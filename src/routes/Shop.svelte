<script lang="ts">
	import { goto } from '$app/navigation';
	import { shopItems } from '$lib/shop';
	import { centsToDollars } from '$lib/utils';
	let goToCheckout = (item: string) => {
		fetch('/api/createCheckoutSession', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ item })
		})
			.then((res) => res.json())
			.then((response) => {
				if (response.sessionUrl) {
					goto(response.sessionUrl);
				}
			});
	};
</script>

<div class="container">
	All prices are in USD.
	{#each Array.from(shopItems.entries()) as item}
		<div>
			<p class="name">{item[1].name}</p>
			<p class="cost">${centsToDollars(item[1].cost)}</p>
			<button on:click={() => goToCheckout(item[0])}>Buy</button>
		</div>
	{/each}
</div>

<style lang="scss">
</style>
