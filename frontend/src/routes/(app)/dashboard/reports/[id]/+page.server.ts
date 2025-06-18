import { apiURL } from "$lib/api_url";
import { checkPermission, permissionError } from "$lib/auth";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({fetch, locals, params}: any) => {
  if (!checkPermission(locals.user, 'view_paymentreport')) {
    return permissionError();
  }


  const response = await fetch(`${apiURL}payment_reports/${params?.id}`);
  const report = await response.json();
  if (!report) {
    throw error(404, 'Report not found');
  }

  return {
    report
  };
};