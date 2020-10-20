import { Message } from 'node-nats-streaming';
import { Listner, OrderCreatedEvent, Subjects } from '@yeapkrush_sgtickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListner extends Listner<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const order = Order.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version
		});
		await order.save();

		msg.ack();
	}
}
