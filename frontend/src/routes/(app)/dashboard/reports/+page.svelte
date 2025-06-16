<script lang="ts">
	import Datatable from '$lib/components/Datatable.svelte';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	export let data: any;
	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom-start'
	};
	let selectedUserId: any = null;
	let inputUser: string = '';
	let loaded = true;
	$: totalAmount = filteredReports.reduce((acc: number, report: any) => {
		return acc + Number(report.amount || 0);
	}, 0);
	$: filteredReports = data.reports.filter((report: any) => report.user.id == selectedUserId) ?? [];
</script>

{#if loaded}
	<div class="flex flex-col">
		<h1 class="h1 mb-[2rem]">Reportes</h1>
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<label for="select-contact" class="text-md my-2">Usuario</label>
				<input
					class="input autocomplete my-2"
					type="search"
					name="autocomplete-search"
					autocomplete="off"
					bind:value={inputUser}
					placeholder="Search..."
					use:popup={popupSettings}
				/>
				<div data-popup="popupAutocomplete" class="max-w-sm w-full card">
					<Autocomplete
						bind:input={inputUser}
						options={data.listUsers}
						on:selection={(e) => {
							inputUser = e.detail.label;
							selectedUserId = e.detail.value;
						}}
					/>
				</div>
			</div>
			<div class="flex flex-col">
				<label for="" class="text-md my-2">Mes</label>
				<input type="month" class="input my-2" name="month" id="month" min="1" max="12" step="1" />
			</div>
		</div>
		{#if selectedUserId}
			<div class="flex flex-row mt-2">
				<h2 class="h2">Total: {totalAmount}$</h2>
			</div>
		{/if}

		{#if selectedUserId}
			<Datatable
				hide_search={true}
				source_data={filteredReports}
				editable={false}
				headings={['ID', 'Contacto', 'Método de Pago', 'Monto', 'Fecha']}
				fields={['id', 'contact_name', 'payment_method_name', 'amount', 'date']}
			/>
		{/if}
	</div>
{/if}
