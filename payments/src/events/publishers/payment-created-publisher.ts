import { Subjects, Publisher, PaymentCreatedEvent } from '@yeapkrush_sgtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
