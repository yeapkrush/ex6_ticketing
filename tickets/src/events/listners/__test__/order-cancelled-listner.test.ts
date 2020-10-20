import { OrderCancelledListner } from '../order-cancelled-listner';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/tickets';
import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@yeapkrush_sgtickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
	const listner = new OrderCancelledListner(natsWrapper.client);

	const orderId = mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		userId: 'asdasd'
	});
	ticket.set({ orderId });
	await ticket.save();

	const data: OrderCancelledEvent['data'] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id
		}
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { msg, data, ticket, orderId, listner };
};

it('updates the ticket, publishes an event, and acks the messaage', async () => {
	const { msg, data, ticket, orderId, listner } = await setup();

	await listner.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(msg.ack).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
