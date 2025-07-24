<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkPermission } from '$lib/auth';
	import Datatable from '$lib/components/Datatable.svelte';
	import { Autocomplete, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	export let data: any;
	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom-start'
	};
	let selectedDate: string = data.selectedDate;
	$: selectedUserId = data.selectedUserId;
	let inputUser: string = data.inputUser || '';
	let loaded = true;
	let listType = 'all';
	$: totalAmount =
		listType == 'all'
			? filteredReports.reduce((acc: number, report: any) => {
					return acc + Number(report.amount || 0);
				}, 0)
			: data.userReports.reduce((acc: number, report: any) => {
					return acc + Number(report.amount || 0);
				}, 0);
	$: filteredReports =
		data.reports.filter((report: any) => String(report.user.id) === String(selectedUserId)) ?? [];

	async function downloadPDF() {
		const response = await fetch(
			'/dashboard/reports/exportpdf?user=' +
				(listType == 'all' ? selectedUserId : data.user.id) +
				'&date=' +
				selectedDate,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
		if (response.ok) {
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');
			setTimeout(() => URL.revokeObjectURL(url), 10000);
		} else {
			console.log('Error al exportar PDF');
		}
	}
</script>

{#if loaded}
	<div class="flex flex-col">
		<div class="flex flex-row items-center justify-between">
			{#if !checkPermission(data.user, 'view_paymentreport')}
				<h1 class="h1 mb-4">Mis Reportes</h1>
			{:else if checkPermission(data.user, 'view_paymentreport') && checkPermission(data.user, 'view_own_paymentreport')}
				<div class="flex flex-col">
					<h1 class="h1 mb-4">Reportes</h1>
					<RadioGroup name="order_type">
						<RadioItem bind:group={listType} name="order_type" value={'all'}
							>Buscar reportes</RadioItem
						>
						<RadioItem bind:group={listType} name="order_type" value={'user'}
							>Mis reportes</RadioItem
						>
					</RadioGroup>
				</div>
			{:else}
				<h1 class="h1 mb-4">Reportes</h1>
			{/if}

			{#if checkPermission(data.user, 'add_paymentreport')}
				<a href="/dashboard/reports/add" class="btn variant-filled max-w-fit px-[2rem] ml-2 h-full">
					<i class="fa-solid fa-plus"></i>
				</a>
			{/if}
		</div>
		{#if checkPermission(data.user, 'view_paymentreport')}
			{#if listType == 'all'}
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
							on:input={() => {
								if (inputUser.length < 1) {
									goto(`?user=&date=${selectedDate}`);
								}
							}}
						/>
						<div data-popup="popupAutocomplete" class="max-w-sm w-full card">
							<Autocomplete
								bind:input={inputUser}
								options={data.listUsers}
								on:selection={(e) => {
									inputUser = e.detail.label;
									selectedUserId = e.detail.value;
									goto(`?user=${selectedUserId}&date=${selectedDate}`);
								}}
							/>
						</div>
					</div>
					<div class="flex flex-col">
						<label for="" class="text-md my-2">Mes</label>
						<input
							type="month"
							class="input my-2"
							name="month"
							id="month"
							min="1"
							max="12"
							step="1"
							bind:value={selectedDate}
							on:change={() => {
								setTimeout(() => {
									goto(`?user=${selectedUserId}&date=${selectedDate}`, { invalidateAll: true });
								}, 90);
							}}
						/>
					</div>
				</div>
			{:else if listType == 'user'}
				<div class="flex flex-col">
					<label for="" class="text-md my-2">Mes</label>
					<input
						type="month"
						class="input my-2 w-fit"
						name="month"
						id="month"
						min="1"
						max="12"
						step="1"
						bind:value={selectedDate}
						on:change={() => {
							goto(`?user=${selectedUserId}&date=${selectedDate}`);
						}}
					/>
				</div>
			{/if}
		{/if}
		{#if (listType == 'all' && selectedUserId) || listType == 'user'}
			<div class="flex flex-row justify-between mt-2">
				<div class="flex flex-col space-y-2">
					<div class="flex flex-row space-x-3">
						<h2 class="h3">Nro. de reportes:</h2>
						<h2 class="h3 font-bold">
							{listType == 'all' ? filteredReports?.length : data.userReports.length}
						</h2>
					</div>
					<div class="flex flex-row space-x-3">
						<h2 class="h3">Monto Total:</h2>
						<h2 class="h3 font-bold">{totalAmount}$</h2>
					</div>
					<div class="flex flex-row space-x-3">
						<h2 class="h2">Comisión:</h2>
						<h2 class="h2 font-bold">
							{((Number(totalAmount) * Number(data?.comission?.percentage || 0)) / 100).toFixed(2)}$
						</h2>
					</div>
				</div>

				{#if (filteredReports.length > 0 && checkPermission(data.user, 'view_export_paymentreport')) || (listType == 'user' && data.userReports.length > 0)}
					<button
						class="btn variant-filled max-w-fit px-[2rem] ml-2 py-3 h-fit"
						type="button"
						on:click={downloadPDF}
					>
						<i class="fa-solid fa-download"></i>
					</button>
				{/if}
			</div>
		{/if}

		{#if selectedUserId && listType == 'all' && checkPermission(data.user, 'view_paymentreport')}
			{#key selectedUserId}
				{#key filteredReports.length}
				<Datatable
					hide_search={true}
					source_data={filteredReports}
					editable={false}
					endpoint={{ main: 'reports' }}
					headings={['ID', 'Contacto', 'Método de Pago', 'Monto', 'Estatus','Fecha']}
					fields={['id', 'contact_name', 'payment_method_name', 'amount', 'status', 'date']}
				/>
				{/key}
			{/key}
		{:else if listType == 'user' && checkPermission(data.user, 'view_paymentreport') || !checkPermission(data.user, 'view_paymentreport') && checkPermission(data.user, 'view_own_paymentreport')}
			{#key data.user.id}
				<Datatable
					hide_search={true}
					source_data={data.userReports}
					editable={false}
					endpoint={{ main: 'reports' }}
					headings={['ID', 'Contacto', 'Método de Pago', 'Monto', 'Estatus','Fecha']}
					fields={['id', 'contact_name', 'payment_method_name', 'amount', 'status', 'date']}
				/>
			{/key}
		{/if}
	</div>
{/if}
