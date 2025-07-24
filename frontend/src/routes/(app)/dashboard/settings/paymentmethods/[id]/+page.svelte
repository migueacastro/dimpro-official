<script lang="ts">
	import { ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
  export let data: any;
	$: loaded = true;

	$: errorMessage = '';
  $: touchedInput = false;
	let name: string = data?.paymentMethod?.name || '';
	$: if (name.length < 1) {
		errorMessage = 'Este campo no puede estar vacío';
	} else {
		errorMessage = '';
	}

	const toastStore = getToastStore();
	const successSettings: ToastSettings = {
		message: 'Método de pago editado exitosamente'
	};
	const errorSettings: ToastSettings = {
		background: 'variant-ghost-error',
		message: 'Error al crear método de pago'
	};
	async function handleSubmit() {
		return async ({ update, result }: any) => {
			if (result.type == 'success') {
				toastStore.trigger(successSettings);
				window.location.href = '/dashboard/settings/paymentmethods';
				return;
			} else {
				toastStore.trigger(errorSettings);
				errorMessage = result?.data?.error;
			}
		};
	}
</script>

{#if !loaded}
	<ProgressRadial></ProgressRadial>
{:else}
	<h1 class="h2 my-4">Editar Método de Pago</h1>
	<form
		action="?/create"
		class=" w-1/2 max-w-md space-y-4"
		method="post"
		use:enhance={handleSubmit}
	>
		<div class="flex flex-col space-y-2">
			<label for="name">Nombre</label>
			<input class="input my-2" type="text" name="name" bind:value={name} 
      on:focus={() => touchedInput = true}/>
		</div>
		{#if errorMessage && errorMessage.length > 0 && touchedInput}
			<div class="card p-4 variant-ghost-error">
				{errorMessage}
			</div>
		{/if}

		<button
			type="submit"
			class="btn variant-filled max-w-fit my-[2rem] px-[2rem]"
			disabled={name.length < 1}
		>
			Guardar
		</button>
		
	</form>
{/if}
