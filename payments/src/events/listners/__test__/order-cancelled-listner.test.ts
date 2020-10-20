import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@yeapkrush_sgtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListner } from '../order-cancelled-listner';
import { Order } from '../../../models/order';

const setup = async () => {
	const listner = new OrderCancelledListner(natsWrapper.client);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		price: 10,
		userId: 'asdads',
		version: 0
	});
	await order.save();

	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		version: 1,
		ticket: {
			id: 'afss'
		}
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listner, data, msg, order };
};

it('updates the status of the order', async () => {
	const { listner, data, msg, order } = await setup();

	await listner.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
	const { listner, data, msg, order } = await setup();

	await listner.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
