import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@yeapkrush_sgtickets/common';
import { TicketUpdatedListner } from '../ticket-updated-listner';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	// Create a lisnter
	const listner = new TicketUpdatedListner(natsWrapper.client);

	// Create and save a ticket
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20
	});
	await ticket.save();

	// Create a fake data object
	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		version: ticket.version + 1,
		title: 'new concert',
		price: 30,
		userId: 'sdfs'
	};

	// Create a fake msg object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	//return all of this stuff
	return { msg, data, ticket, listner };
};

it('finds, updata, and saves a ticke', async () => {
	const { msg, data, ticket, listner } = await setup();

	await listner.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
	const { msg, data, listner } = await setup();

	await listner.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped a version number', async () => {
	const { msg, data, listner, ticket } = await setup();

	data.version = 10;

	try {
		await listner.onMessage(data, msg);
	} catch (err) {}
	expect(msg.ack).not.toHaveBeenCalled();
});
