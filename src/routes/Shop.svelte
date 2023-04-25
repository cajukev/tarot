<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { shopItems, type ShopItem } from '$lib/shop';
	import { centsToDollars } from '$lib/utils';
  import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
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

  let buyWithEssence = (item: ShopItem) => {
    fetch('/api/buyWithEssence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item })
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          invalidateAll();
          toast.push('Item purchased with essence');
        }
      });
  }
</script>

<div class="container screenPadding">
	<p class="prices">All prices are in USD.<p>
  <p class="essence">You currently have <span>{$page.data.profile.data.essence}</span> essence</p>
  <div class="items">

    {#each Array.from(shopItems.entries()) as item}
		<div>
      <p class="name">{item[1].name}</p>
      {#if item[1].type === 'Essence'}
			  <p class="cost">${centsToDollars(item[1].cost)}</p>
			  <button on:click={() => goToCheckout(item[0])}>Buy</button>
        {:else}
        <!-- Pay with Essence -->
        {item[1].cost} Essence
        <button class="cost" on:click={ 
          () => {
            buyWithEssence(item[1]);
          }
        }>Buy</button>
      {/if}
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
    .essence{
      padding-bottom: 1rem;
      span{
        font-weight: bold;
      }
    }
    .items{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      gap: 1rem;
      div{
        background: $bg;
        border-radius: 0.5rem;
        padding: 1rem;
        width: 8rem;
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
