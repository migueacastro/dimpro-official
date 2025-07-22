import { apiURL } from "$lib/api_url";
import { checkPermission, permissionError } from "$lib/auth";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({fetch, locals, params}: any) => {
  if (!checkPermission(locals.user, 'view_paymentreport')  || checkPermission(locals.user, 'view_own_paymentreport')) {
    return permissionError();
  }
  

  const response = await fetch(`${apiURL}payment_reports/${params?.id}`);
  const report = await response.json();

  if (!report) {
    throw error(404, 'Report not found');
  }

  if (!checkPermission(locals.user, 'view_own_paymentreport') && locals.user.id == report?.user?.id) {
    return permissionError();
  }

  return {
    report
  };
};

export const actions: Actions = {
  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const response = await fetch(apiURL + 'payment_reports/' + id + '/', {
      method: 'DELETE'
    });
    if (response.ok) {
      return {
        success: true
      };
    } else {
      const data = await response.json();
      console.log(data);
      return {
        success: false,
        error: { data }
      };
    }
  }
};