import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
		body: {
			ticketId: ticket.id
		},
		onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
	});

	return (
		<div className="card" style={{ maxWidth: '400px', marginTop: '30px' }}>
			<div className="card-body">
				<h2 className="card-title">{ticket.title}</h2>
				<h4 className="card-subtitle">Price: {ticket.price}</h4>
				{errors}
				<button onClick={() => doRequest()} className="btn btn-primary">
					Purchase
				</button>
			</div>
		</div>
	);
};

TicketShow.getInitialProps = async (context, client) => {
	const { ticketId } = context.query;
	const { data } = await client.get(`/api/tickets/${ticketId}`);

	return { ticket: data };
};

export default TicketShow;
