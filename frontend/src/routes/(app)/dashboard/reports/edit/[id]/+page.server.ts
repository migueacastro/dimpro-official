import { apiURL } from '$lib/api_url';
import { checkPermission, permissionError } from '$lib/auth';
import { error, type Actions } from '@sveltejs/kit';
import { report } from 'process';

export async function load({ fetch, locals, params }: any) {
	if (!checkPermission(locals.user, 'change_paymentreport')) {
		return permissionError();
	}


	let response = await fetch(apiURL + 'contacts');
	let contacts = await response.json();

	response = await fetch(apiURL + 'payment_methods');
	let paymentMethods = await response.json();

	

	let sellerList: any = [];
	if (checkPermission(locals.user, 'select_custom_seller_paymentreport')) {
		response = await fetch(apiURL + 'users');
		let sellers = await response.json();
		sellerList =
			sellers.map((seller: any) => ({
				label: seller.name,
				value: seller.id
			})) ?? [];
	}

	response = await fetch(apiURL + 'payment_reports/'+params.id);
	const report = await response.json();
	if (!report) {
		throw error(404, 'Report not found');
	}
	return {
		sellerList,
		contacts,
		paymentMethods,
		report,
	};
}

export const actions: Actions = {
	edit: async ({ locals, fetch, request, params }: any) => {
		const formData = await request.formData();
		const response = await fetch(apiURL + 'payment_reports' + '/'+ params.id+'/', {
			method: 'PATCH',
			body: JSON.stringify(Object.fromEntries(formData))
		});

		if (response.ok) {
			const data = await response.json();
			return {
				success: true,
				report: data
			};
		} else {
			const text = await response.text();
			console.log(text);
			return error(400, {
				message: text
			});
		}
	}
};
