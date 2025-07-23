import { apiURL } from "$lib/api_url";
import { checkPermission, permissionError } from "$lib/auth";
import type { Actions } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

export async function load({ fetch, params, locals }: any) {
  if (!checkPermission(locals.user, 'change_paymentmethod')) {
    return permissionError();
  }
  const response = await fetch(apiURL + 'payment_methods/' + params.id);
  if (!response.ok) {
    return error(response.status, { message: 'Failed to load payment method' });
  }
  const paymentMethod = await response.json();
  return {
    paymentMethod
  };
}

export const actions: Actions = {
  edit: async ({ fetch, request }: any) => {
    const formData = await request.formData();
    const response = await fetch(apiURL+ 'payment_methods' + '/', {
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
