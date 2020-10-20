import { Publisher, Subjects, TicketUpdatedEvent } from '@yeapkrush_sgtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
