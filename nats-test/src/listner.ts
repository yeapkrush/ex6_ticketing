import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListner } from './events/ticket-created-lisnter';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222'
});

stan.on('connect', () => {
	console.log('Listner connected to NATS');

	stan.on('close', () => {
		console.log('NATS connection closed!');
		process.exit();
	});

	new TicketCreatedListner(stan).listen();
});
