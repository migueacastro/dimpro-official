import { apiURL } from "$lib/api_url";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { checkPermission, permissionError } from "$lib/auth";

export const load: PageServerLoad = async ({fetch, locals}) => {
  if (!checkPermission(locals.user, 'change_comission')) {
    return permissionError();
  }
  const response = await fetch(apiURL+'comissions');
  const comissions = await response.json();
  const comission = comissions[0] || null;
  return {
    comission
  }
};

export const actions: Actions = {

  update: async ({ request, fetch }) => {
    const formData = await request.formData();
    const percentage = formData.get('percentage');
    const response = await fetch(apiURL + 'comissions/1/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ percentage })
    });
    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: { data } };
    }
  }
};