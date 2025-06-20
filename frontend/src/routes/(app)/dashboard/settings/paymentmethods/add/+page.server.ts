import { apiURL } from "$lib/api_url";
import { checkPermission, permissionError } from "$lib/auth";
import type { Actions } from "@sveltejs/kit";
import { error } from "console";

export function load({locals}: any) {
  if (!checkPermission(locals.user, 'add_paymentmethod')) {
    return permissionError();
  }
}

export const actions: Actions = {
  create: async ({ fetch, request }: any) => {
    const formData = await request.formData();
    const response = await fetch(apiURL+ 'payment_methods' + '/', {
      method: 'POST',
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
