import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListner } from './events/listners/ticket-created-listner';
import { TicketUpdatedListner } from './events/listners/ticket-updated-listner';
import { ExpirationCompleteListner } from './events/listners/expiration-complete-listner';
import { PaymentCreatedListner } from './events/listners/payment-created-listner';

const start = async () => {
	console.log('starting ...');

	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('NATS_CLIENT_ID must be defined');
	}

	if (!process.env.NATS_URL) {
		throw new Error('NATS_URL must be defined');
	}

	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('NATS_CLUSTER_ID must be defined');
	}

	try {
		await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed!');
			process.exit();
		});
		process.on('SIGINT', () => {
			natsWrapper.client.close();
		});
		process.on('SIGTERM', () => {
			natsWrapper.client.close();
		});

		new TicketCreatedListner(natsWrapper.client).listen();
		new TicketUpdatedListner(natsWrapper.client).listen();
		new ExpirationCompleteListner(natsWrapper.client).listen();
		new PaymentCreatedListner(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log('Connected to MongoDb');
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log('Listening on Port 3000!!');
	});
};

start();
