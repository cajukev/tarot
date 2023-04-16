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

<div class="container screenPadding">
	<p class="prices">All prices are in USD.<p>
  <div class="items">

    {#each Array.from(shopItems.entries()) as item}
		<div>
      <p class="name">{item[1].name}</p>
			<p class="cost">${centsToDollars(item[1].cost)}</p>
			<button on:click={() => goToCheckout(item[0])}>Buy</button>
		</div>
    {/each}
  </div>
</div>

<style lang="scss">
  .container{
    text-align: center;
    .prices{
      padding-bottom: 1rem;
    }
    .items{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0 auto;
      gap: 1rem;
      div{

        background: $bg;
        border-radius: 0.5rem;
        padding: 1rem;
        width: 10rem;
        button{
          background-color: #000;
          border: none;
          border-radius: 5px;
          color: #fff;
          cursor: pointer;
          font-size: 1.2rem;
          margin-top: 10px;
          padding: 5px;
          width: 100%;
        }
      }
    }
  }
    
</style>
