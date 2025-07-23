<script lang="ts">
	export let data: any;
	import { enhance } from '$app/forms';
	import { checkPermission } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { getToastStore, getModalStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ModalSettings } from '@skeletonlabs/skeleton';
	import { tick } from 'svelte';
	const toastStore = getToastStore();
	const modalStore = getModalStore();
	let loaded = true;
  let report = data.report;
	let form: HTMLFormElement;
	let comission = data.comission;
	async function confirmSave() {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Modificar porcentaje de comisión`,
			body: `¿Está seguro de cambiar el porcentaje de la comisión?`,

			response: async (r: boolean) => {
				if (r) {
					form.requestSubmit();
				}
			}
		};
		modalStore.trigger(modal);
	}
	async function handleEnhance() {
		return async ({ update, result }: any) => {
			let toast: ToastSettings = {
				message: 'Porcentaje actualizado con exito.',
				background: 'variant-ghost-success',
				timeout: 3500
			};
			if (result?.type === 'success') {
				toastStore.trigger(toast);
				window.location.href = '/dashboard/settings';
				return;
			} else {
				toast = {
					message: `¡ERROR! No se pudo actualizar el porcentaje de comisión.`,
					background: 'variant-ghost-error',
					timeout: 3500
				};
				toastStore.trigger(toast);
			}
			return update({ reset: false });
		};
	}
</script>

<div class=" mx-auto flex flex-col lg:w-1/2 w-full">
	<form method="post" action="?/update" use:enhance={handleEnhance} bind:this={form}>
		<h3 class="text-4xl mb-[2rem]">Cambiar Porcentaje de Comisión</h3>
		<div class="input-group input-group-divider grid-cols-[1fr_auto] my-2">
			<input
				class="input"
				title="Porcentaje de comisión"
				type="number"
				id="percentage"
				name="percentage"
				min="0"
				step="0.01"
				placeholder="percentage"
				bind:value={comission.percentage}
			/>
		</div>

		<button
			on:click={confirmSave}
			type="button"
			class="btn btn-xl variant-filled-primary my-2 w-fit shadow-xl">Guardar</button
		>
	</form>
</div>
