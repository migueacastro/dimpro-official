import { apiURL } from '$lib/api_url';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	let response = await fetch(apiURL+'payment_reports');
	let reports = await response.json();
  console.log(reports);
	response = await fetch(apiURL+'users');
	let users = await response.json();
  console.log(users)
	const listUsers = users.map((user: any) => {
		return {
			label: user.name,
			value: user.id
		};
	});
	return {
		reports,
		listUsers,
    users,
	};
};
