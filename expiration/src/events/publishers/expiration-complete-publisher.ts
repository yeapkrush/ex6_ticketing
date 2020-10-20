import { Subjects, Publisher, ExpirationCompleteEvent } from '@yeapkrush_sgtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
