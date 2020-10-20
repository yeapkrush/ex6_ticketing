import { Subjects, Publisher, OrderCancelledEvent } from '@yeapkrush_sgtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
