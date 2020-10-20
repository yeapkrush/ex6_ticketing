import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@yeapkrush_sgtickets/common';
import { OrderCreatedListner } from '../order-created-listner';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/tickets';

const setup = async () => {
	// Create an instance of the listner
	const listner = new OrderCreatedListner(natsWrapper.client);

	// Create and save ticket
	const ticket = Ticket.build({
		title: 'concer',
		price: 99,
		userId: 'asdasdc'
	});
	await ticket.save();

	// Create the fake data event
	const data: OrderCreatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		userId: 'asdfafew',
		expiresAt: 'fefe',
		version: 0,
		ticket: {
			id: ticket.id,
			price: ticket.price
		}
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listner, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
	const { listner, ticket, data, msg } = await setup();

	await listner.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acts the message', async () => {
	const { listner, ticket, data, msg } = await setup();

	await listner.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
	const { listner, ticket, data, msg } = await setup();

	await listner.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
