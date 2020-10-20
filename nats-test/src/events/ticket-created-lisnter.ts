import { Message } from 'node-nats-streaming';
import { Listner } from './base-listner';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
	//Old code:
	//subject: Subjects.TicketCreated = Subjects.TicketCreated;
	//New code:
	readonly subject = Subjects.TicketCreated;

	queGroupName = 'payments-service';

	onMessage(data: TicketCreatedEvent['data'], msg: Message) {
		console.log('Event data!', data);

		msg.ack();
	}
}
