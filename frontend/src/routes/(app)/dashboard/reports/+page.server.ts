import { apiURL } from '$lib/api_url';
import { checkPermission, permissionError } from '$lib/auth';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
	if (!checkPermission(locals.user, 'view_paymentreport') && !checkPermission(locals.user, 'view_own_paymentreport')) {
		permissionError();
	}

	let qs = url.searchParams.toString() ? `?${url.searchParams.toString()}` : '';
	let response: any;
	let reports: any = [];
	let userReports: any = [];
	let hasDate = url.searchParams.has('date');
	const searchUserId = url.searchParams.get('user') ?? '';
	if (checkPermission(locals.user, 'view_paymentreport') ) {
		response = await fetch(apiURL+'payment_reports_user_month' + qs);
		reports = await response.json();
	}
	if (checkPermission(locals.user, 'view_own_paymentreport')) {
		url.searchParams.set('user', locals?.user?.id);
		if (!url.searchParams.has('date')) {
			url.searchParams.set('date', new Date().toISOString().split('T')[0]);
		}
		qs = url.searchParams.toString() ? `?${url.searchParams.toString()}` : '';
		response = await fetch(apiURL+'payment_reports_user_month' + qs);
		userReports = await response.json();
	}

	response = await fetch(apiURL + 'comissions/1');
	let comission = await response.json();
	
	response = await fetch(apiURL+'users');
	let users = await response.json();
	const listUsers = users.map((user: any) => {
		return {
			label: user.name,
			value: user.id
		};
	});
	url.searchParams.set('user', searchUserId);
	let selectedDate = hasDate ? url.searchParams.get('date') : new Date().toISOString().split('T')[0].split('-').slice(0,2).join('-');
	const selectedUserId = url.searchParams.get('user') ?? '';
	const inputUser = listUsers.find((user: any) => user.value == selectedUserId)?.label;

	return {
		userReports,
		reports,
		listUsers,
    users,
		selectedUserId,
		selectedDate,
		inputUser,
		comission
	};
};
