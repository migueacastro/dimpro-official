import { apiURL } from '$lib/api_url';

export async function changestatus({ fetch, request }: any) {
	const formData: FormData = await request.formData();

	const orderStatus = formData.get('reportStatus') ?? '';
	const newReportStatus = orderStatus === 'pagado' ? 'pendiente' : 'pagado';

	const reportId: any = formData.get('reportId') ?? '';

	const response = await fetch(apiURL + 'payment_reports/' + reportId + '/', {
		method: 'PATCH',
		body: JSON.stringify({
			status: newReportStatus
		})
	});

	if (response.ok) {
		const data = await response.json();
		return {
			success: true,
			data: data.status
		};
	}

	console.error('PATCH request failed:', response.status, await response.text());
	return {
		success: false
	};
}
