import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@yeapkrush_sgtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListner } from '../order-created-listner';
import { Order } from '../../../models/order';

const setup = async () => {
	const listner = new OrderCreatedListner(natsWrapper.client);

	const data: OrderCreatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		expiresAt: 'adas',
		userId: 'adads',
		status: OrderStatus.Created,
		ticket: {
			id: 'sfsd',
			price: 10
		}
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listner, data, msg };
};

it('replicates the order info', async () => {
	const { listner, data, msg } = await setup();

	await listner.onMessage(data, msg);

	const order = await Order.findById(data.id);

	expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
	const { listner, data, msg } = await setup();

	await listner.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
