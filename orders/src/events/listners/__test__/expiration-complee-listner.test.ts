import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent } from '@yeapkrush_sgtickets/common';
import { ExpirationCompleteListner } from '../expiration-complete-listner';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	const listner = new ExpirationCompleteListner(natsWrapper.client);

	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'Cocert',
		price: 20
	});
	await ticket.save();
	const order = Order.build({
		status: OrderStatus.Created,
		userId: 'adasda',
		expiresAt: new Date(),
		ticket
	});
	await order.save();

	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listner, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
	const { listner, order, data, msg } = await setup();

	await listner.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
	const { listner, order, data, msg } = await setup();

	await listner.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
	expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
	const { listner, data, msg } = await setup();

	await listner.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
