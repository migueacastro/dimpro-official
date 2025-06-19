<script>
	import Datatable from '$lib/components/Datatable.svelte';
	export let data;
	let payment_methods = data.payment_methods || [];
</script>

	<h1 class="h2 my-4">Métodos de pago</h1>
	<Datatable
		editable={false}
		source_data={payment_methods}
		endpoint={{ main: 'payment_methods' }}
		headings={['ID', 'Nombre',]}
		fields={['id', 'name']}
	/>

