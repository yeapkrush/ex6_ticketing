import { Message } from 'node-nats-streaming';
import { Subjects, Listner, TicketCreatedEvent } from '@yeapkrush_sgtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
		const { id, title, price } = data;
		const ticket = Ticket.build({
			id,
			title,
			price
		});

		await ticket.save();

		msg.ack();
	}
}
