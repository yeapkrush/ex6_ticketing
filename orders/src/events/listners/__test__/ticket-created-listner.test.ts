import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@yeapkrush_sgtickets/common';
import { TicketCreatedListner } from '../ticket-created-listner';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	// creates an instance of the listener
	const listner = new TicketCreatedListner(natsWrapper.client);

	// creates a fake data event
	const data: TicketCreatedEvent['data'] = {
		version: 0,
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString()
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listner, data, msg };
};

it('creates and saves a ticket', async () => {
	const { listner, data, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listner.onMessage(data, msg);

	// write assertions to make sure a ticket was created
	const ticket = await Ticket.findById(data.id);

	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it('acts the message', async () => {
	const { data, listner, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listner.onMessage(data, msg);

	// write assertions to make sure ask function is called
	expect(msg.ack).toHaveBeenCalled();
});
