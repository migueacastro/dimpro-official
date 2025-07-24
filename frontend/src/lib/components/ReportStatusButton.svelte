<script lang="ts">
	import type { ToastSettings, ModalSettings } from '@skeletonlabs/skeleton';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	export let report: any;
	import { enhance } from '$app/forms';

	let modalStore = getModalStore();
	let toastStore = getToastStore();
	let body: any = {};

	function handleSubmit() {
		return async ({ update, result }: any) => {
			if (result?.type == 'success') {
				report.status = report?.status == 'pendiente' ? 'pagado' : 'pendiente';
				const toast: ToastSettings = {
					message: 'Estatus cambiado con exito.',
					background: 'variant-ghost-success',
					timeout: 3500
				};
				toastStore.trigger(toast);
			} else if (result?.type == 'failure') {
				const toast: ToastSettings = {
					message: `¡ERROR! El estatus del reporte de pago no se pudo cambiar.`,
					background: 'variant-ghost-error',
					timeout: 3500
				};
				toastStore.trigger(toast);
			}
			await update({ reset: false });
		};
	}

	function handleClick(event: Event) {
		// Find the form element
		const form = (event.target as HTMLElement).closest('form') as HTMLFormElement;

		const modal: ModalSettings = {
			type: 'confirm',
			title: `Cambiar estatus`,
			body: `¿Confirma cambiar el estatus del reporte de pago?`,
			response: async (r: boolean) => {
				if (r && form) {
					form.requestSubmit(); // Programmatically submit the form
				}
			}
		};
		modalStore.trigger(modal);
	}
</script>

<form class="mx-2" action="?/changestatus" method="post" use:enhance={handleSubmit}>
	<input type="hidden" name="reportId" value={report?.id} />
	<input type="hidden" name="reportStatus" value={report?.status} />
	<button
		type="button"
		on:click={handleClick}
		class="capitalize btn max-w-fit px-[2rem]"
		class:variant-filled={report?.status === 'pendiente'}
		class:variant-filled-primary={report?.status === 'pagado'}
	>
		{report?.status}
	</button>
</form>
