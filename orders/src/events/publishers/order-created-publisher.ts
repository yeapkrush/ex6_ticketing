import { Publisher, OrderCreatedEvent, Subjects } from '@yeapkrush_sgtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
