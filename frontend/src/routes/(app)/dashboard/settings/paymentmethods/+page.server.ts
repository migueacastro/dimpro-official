import { apiURL } from '$lib/api_url';
import type { RequestEvent } from '@sveltejs/kit';
import { checkPermission, permissionError } from '$lib/auth';
import type { Actions } from '@sveltejs/kit';

export const load = async ({ fetch, locals }: RequestEvent) => {
	
	if (!checkPermission(locals.user, 'view_paymentmethod')) {
		return permissionError();
	}
	let response = await fetch(apiURL + 'payment_methods');
	let payment_methods: any = await response.json();

	
	return {
		payment_methods,
	};
};


export const actions: Actions = {
		handleDelete: async ({request,fetch}) => {
				const formData = await request.formData();
				const id = formData.get("id");
				let response = await fetch(apiURL+`payment_methods/${id}/`,{
						method:"DELETE"
				});
				return {
						success:response.ok,
						error:response.statusText
				}
		}
}