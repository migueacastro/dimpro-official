<script>
	import { checkPermission } from '$lib/auth';
	import Datatable from '$lib/components/Datatable.svelte';
	export let data;
	let payment_methods = data.payment_methods || [];
</script>

<div class="flex flex-row items-center">
	<h1 class="h2 my-4">Métodos de pago</h1>
	{#if checkPermission(data.user, 'add_paymentmethod')}
		<a href="/dashboard/settings/paymentmethods/add" class="btn variant-filled max-w-fit px-[2rem] ml-2 h-full">
			<i class="fa-solid fa-plus"></i>
		</a>
	{/if}
</div>

<Datatable
	editable={true}
	source_data={payment_methods}
	endpoint={{ edit:'paymentmethods', add:'settings/paymentmethods/add' }}
	headings={['ID', 'Nombre']}
	model_name={'paymentmethod'}
	fields={['id', 'name']}
	table_name={'Método de Pago'}
	user={data.user}
	hide_info={true}
/>
