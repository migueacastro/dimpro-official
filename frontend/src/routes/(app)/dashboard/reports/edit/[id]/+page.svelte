<script lang="ts">
	import { ProgressRadial, Autocomplete, getToastStore } from '@skeletonlabs/skeleton';
	import type { PopupSettings, AutocompleteOption, ToastSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import { checkAdminGroup, checkPermission } from '$lib/auth.js';
	import levenshtein from 'string-comparison';
	$: loaded = true;
	export let data: any;
	let popupSettingsContact: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteContact',
		placement: 'bottom'
	};
	let popupSettingsSeller: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteSeller',
		placement: 'bottom'
	};

	$: errorMessage = '';

	let paymentMethods: any = data.paymentMethods ?? [];

	let inputContact: string = data.report?.contact?.name ?? '';
	let selectedContactId: any = data.report?.contact?.id ?? '';
	let contactList: AutocompleteOption<number, string>[] = [];

	let sellerList: AutocompleteOption<number, string>[] = [];
	let inputSeller: string = data.report.user.name ?? '';
	let selectedSellerId: any = checkPermission(data.user, 'select_custom_seller_paymentreport')
		? data.report.user.id || data.user.id
		: data.user.id;

	let amount: number = data.report.amount ?? 1;
	let report: any = data.report ?? {};

	const toastStore = getToastStore();
	const successSettings: ToastSettings = {
		message: 'Reporte editado exitosamente'
	};
	const errorSettings: ToastSettings = {
		background: 'variant-ghost-error',
		message: 'Error al editar reporte'
	};
	async function handleSubmit() {
		return async ({ update, result }: any) => {
			if (result.type == 'success') {
				toastStore.trigger(successSettings);
				const report_id = result.data.report.id;
				console.log('Report ID:', report_id);
				await downloadPDF(report_id);
				window.location.href = '/dashboard/reports/' + report_id;
				return;
			} else {
				toastStore.trigger(errorSettings);
				errorMessage = result?.data?.error;
			}
		};
	}
	$: if (!checkPermission(data.user, 'view_all_contacts_paymentreport')) {
		if (checkAdminGroup(data.user)) {
			contactList =
				data.contacts
					.filter((contact: any) => String(contact.seller_name).toLowerCase() === String('casa'))
					.map((contact: any) => ({
						label: contact.name,
						value: contact.id
					})) ?? [];
		} else {
			contactList =
				data.contacts
					.filter(
						(contact: any) =>
							levenshtein.levenshtein.similarity(
								String(contact.seller_name).toLowerCase(),
								String(data.user.name).toLowerCase()
							) > 0.7
					)
					.map((contact: any) => ({
						label: contact.name,
						value: contact.id
					})) ?? [];
		}
	} else {
		contactList =
			data.contacts.map((contact: any) => ({
				label: contact.name,
				value: contact.id
			})) ?? [];
	}

	$: if (!checkPermission(data.user, 'select_custom_seller_paymentreport')) {
		sellerList = [
			{
				label: data.user.name,
				value: data.user.id
			}
		];
	} else {
		sellerList = data?.sellerList;
	}

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
</script>

{#if !loaded}
	<ProgressRadial></ProgressRadial>
{:else}
	<h1 class="h2 my-4">Editar Reporte</h1>
	<form action="?/edit" class=" w-1/2 max-w-md space-y-4" method="post" use:enhance={handleSubmit}>
		<input type="hidden" name="user" bind:value={selectedSellerId} />
		{#if checkPermission(data.user, 'select_custom_seller_paymentreport')}
			<div class="flex flex-col space-y-2">
				<label for="user">Vendedor</label>
				<input
					class="input autocomplete my-2"
					type="search"
					name="autocomplete-search"
					autocomplete="off"
					bind:value={inputSeller}
					placeholder="Search..."
					use:popup={popupSettingsSeller}
				/>
			</div>
			<div data-popup="popupAutocompleteSeller" class="max-w-md w-full card">
				<Autocomplete
					bind:input={inputSeller}
					options={sellerList}
					on:selection={(e) => {
						inputSeller = e?.detail?.label;
						selectedSellerId = e?.detail?.value;
					}}
				/>
			</div>
		{/if}
		<div class="flex flex-col space-y-2">
			<input type="hidden" name="contact" bind:value={selectedContactId} />
			<label for="">Contacto</label>
			<input
				class="input autocomplete my-2"
				type="search"
				name="autocomplete-search"
				autocomplete="off"
				bind:value={inputContact}
				placeholder="Search..."
				use:popup={popupSettingsContact}
			/>
		</div>
		<div data-popup="popupAutocompleteContact" class="max-w-md w-full card">
			<Autocomplete
				bind:input={inputContact}
				options={contactList}
				on:selection={(e) => {
					inputContact = e?.detail?.label;
					selectedContactId = e?.detail?.value;
				}}
			/>
		</div>
		<div class="flex flex-col space-y-2">
			<label for="payment_method"> Método de Pago </label>
			<select
				class="select"
				name="payment_method"
				id="payment_method"
				bind:value={report.payment_method_id}
			>
				{#each paymentMethods as method}
					<option value={method.id}>{method.name}</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-col space-y-2">
			<label for="amount">Monto</label>
			<input
				name="amount"
				bind:value={amount}
				type="number"
				min="1"
				on:input={() => {
					if (amount < 0) {
						amount = 1;
					}
				}}
				step="0.01"
				class="input"
			/>
		</div>
		<div class="flex flex-col space-y-2">
			<label for="description">Descripción</label>
			<textarea name="description" id="description" class="textarea"
				>{data.report.description}</textarea
			>
		</div>
		<button
			type="submit"
			class="btn variant-filled max-w-fit my-[2rem] px-[2rem]"
			disabled={!selectedContactId || !selectedSellerId || !amount || amount <= 0}
		>
			Crear
		</button>
		{#if errorMessage && errorMessage.length > 0}
			<div class="card p-4 variant-ghost-error">
				{errorMessage}
			</div>
		{/if}
		<div class="card p-4 variant-ghost-primary">
			Nota: De no aparecer ningun contacto, verifique que el nombre en su cuenta sea correcto.
		</div>
	</form>
{/if}
