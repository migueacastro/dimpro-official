<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { checkPermission } from '$lib/auth';
	import type { ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	export let data: any;
	let report = data.report;
	let modalStore = getModalStore();
	let toastStore = getToastStore();
	let reportDeleteForm: HTMLFormElement;

	async function downloadPDF(report_id: number) {
		const response = await fetch(`/dashboard/reports/exportpdf/` + report_id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');
			setTimeout(() => URL.revokeObjectURL(url), 10000);
		} else {
			console.error('No se pudo descargar el PDF');
		}
	}

	async function confirmDelete() {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Eliminar reporte`,
			body: `¿Está seguro de querer eliminar este reporte?`,
			response: async (r: boolean) => {
				if (r) {
					reportDeleteForm.requestSubmit();
				}
			}
		};
		modalStore.trigger(modal);
	}
	async function handleDelete() {
		return async ({ update, result }: any) => {
			let toast: ToastSettings;
			if (result?.type == 'success') {
				toast = {
					message: 'El reporte se eliminó con exito.',
					background: 'variant-ghost-success',
					timeout: 3500
				};
				console.log('Successfully deleted');
				goto(`/dashboard/reports`);
				toastStore.trigger(toast);
			} else {
				toast = {
					message: `¡ERROR! El reporte no se pudo eliminar.
							\nmensaje:${result.data}`,
					background: 'variant-ghost-error',
					timeout: 3500
				};
				toastStore.trigger(toast);
			}
		};
	}
</script>

<div class="flex flex-col">
	<div class="flex flex-col lg:flex-row">
		<div class="card p-[3rem] w-full mb-[2rem]">
			<div class="flex flex-col">
				<h1 class="h1 mb-[3rem] font-bold">Reporte #{report?.id}</h1>
				<h4 class="h4 capitalize my-2">Contacto: {report?.contact?.name}</h4>
				<h4 class="h4 capitalize my-2">Vendedor: {report?.user?.name}</h4>
				<h4 class="h4 capitalize my-2">Monto: {report?.amount}</h4>
				<h4 class="h4 capitalize my-2">Método de pago: {report?.payment_method_name}</h4>
				<h4 class="h4 capitalize my-2">Fecha: {report?.date}</h4>
				<h4 class="h4 capitalize my-2">Descripción: {report?.description}</h4>
				<div class="flex flex-row mt-2">
					{#if checkPermission(data.user, 'view_export_paymentreport')}
						<button
							class="btn variant-filled max-w-fit px-[2rem] ml-2 py-3 h-fit"
							type="button"
							on:click={() => downloadPDF(report?.id)}
						>
							<i class="fa-solid fa-download"></i>
						</button>
					{/if}
					{#if checkPermission(data.user, 'delete_paymentreport')}
						<form
							action="?/delete"
							method="post"
							bind:this={reportDeleteForm}
							use:enhance={handleDelete}
						>
							<input type="hidden" name="id" value={report?.id} />
							<button
								class="btn variant-filled max-w-fit px-[2rem] ml-2 py-3 h-fit"
								type="button"
								on:click={confirmDelete}
							>
								<i class="fa-solid fa-trash"></i>
							</button>
						</form>
					{/if}
					{#if checkPermission(data.user, 'change_paymentreport')}
						<button
							class="btn variant-filled max-w-fit px-[2rem] ml-2 py-3 h-fit"
							type="button"
							on:click={() => goto('/dashboard/reports/edit/' + report?.id)}
						>
							<i class="fa-solid fa-pencil"></i>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
