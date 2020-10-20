import { Publisher, Subjects, TicketCreatedEvent } from '@yeapkrush_sgtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
