<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { shopItems, type ShopItem } from '$lib/shop';
	import { centsToDollars } from '$lib/utils';
  import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
  import characters from '$lib/characters';
	import ItemList from './ItemList.svelte';
	import { cardbacks } from '$lib/customization';
	import { achievement as achievementToast } from '$lib/toastStubs';

  let loading = false;

	let goToCheckout = (item: string) => {
    loading = true;
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
          loading = false;
					goto(response.sessionUrl);
				}
			});
	};

  let buyWithEssence = (item: ShopItem) => {
    loading = true;
    fetch('/api/buyWithEssence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item })
    })
      .then((res) => res.json())
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          invalidateAll()
          .then(() => {
            if(item.type !== 'Tokens'){
              selected = -1;
            }
            loading = false;
            setupItemList();
          });
          achievementToast(`Bought ${item.name}`, {});
        }
      });
  }
  // Shop items in a ItemList, only one can be selected at a time
  // When one is selected, the item info is displayed and the buy button is enabled

  let listItems: ListItem[] = [];

  let setupItemList = () => {
    listItems = [];
    let img = '';
    
    for (let i = 0; i < Array.from(shopItems.entries()).length; i++) {
      switch(Array.from(shopItems.entries())[i][1].type){
        case 'ReaderPack':
          img = '/cards/' + cardbacks.find(c => c.name === Array.from(shopItems.entries())[i][1].name)?.image + '-200.webp';
          break;
        case 'Reader':
          img = '/options/' + Array.from(shopItems.entries())[i][1].name + '-200.webp';
          break;
        case 'Essence':
          img = '/resources/Essence-120.webp';
          break;
        case 'Tokens':
          img = '/resources/Token-120.webp';
          break;
      }

      listItems.push({
        id: i,
        name: Array.from(shopItems.entries())[i][1].name,
        img: img,
        selected: false,
        action: () => {
          selectItem(i);
        },
        bought: $page.data.profile.data.bought_items.includes(Array.from(shopItems.entries())[i][1].key)  
      });
    }
    // Purchase History Item
    listItems.push({
      id: listItems.length,
      name: 'Purchase History',
      img: '',
      selected: false,
      action: () => {
        selectItem(listItems.length - 1);
      },
    });
  };
  setupItemList();

  let selected = -1;

  let selectItem = (id: number) => {
    if (selected === id) {
      return;
    } else {
      selected = id;
    }
    for (let i = 0; i < listItems.length; i++) {
      if (i === id) {
        listItems[i].selected = true;
      } else {
        listItems[i].selected = false;
      }
    }
  };
  selectItem(0);

</script>

<div class="container screenPadding">
	<p class="prices info">All prices are in USD <br> All purchases are non-refundable<p>
  <p class="essence">You currently have <span>{$page.data.profile.data.essence}</span> essence</p>

  <ItemList items={listItems} />

  <!-- Shop item info -->
  {#if selected !== -1 && selected !== listItems.length - 1}
    <div class="itemInfo">
      <p class="name">{Array.from(shopItems.entries())[selected][1].name}</p>
      <p class="description">{Array.from(shopItems.entries())[selected][1].description}</p>
      {#if Array.from(shopItems.entries())[selected][1].type === 'Essence'}
        {#if Array.from(shopItems.entries())[selected][1].extra?.amount }
          <p>+ {Array.from(shopItems.entries())[selected][1].extra?.amount} bonus tokens</p>
        {/if}
        <p class="cost">Costs ${centsToDollars(Array.from(shopItems.entries())[selected][1].cost)}</p>
        <button on:click={() => goToCheckout(Array.from(shopItems.entries())[selected][0])}>Buy</button>
      {:else}
        <!-- Pay with Essence -->
        <p>Costs {Array.from(shopItems.entries())[selected][1].cost} Essence</p>
        <button class="cost" disabled={loading} on:click={ 
          () => {
            buyWithEssence(Array.from(shopItems.entries())[selected][1]);
          }
        }>Buy</button>
      {/if}
    </div>
  {/if}
  <!-- Purchase History -->
  {#if selected === listItems.length - 1}
    <div class="itemInfo">
      <p class="name">Purchase History</p>
      {#each $page.data.profile.data.purchase_history as boughtItem }
        <!-- html table date and name -->
        <p>{boughtItem.date} - {boughtItem.item}</p>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .container{
    text-align: center;
    p{
      margin-bottom: 1rem;
    }
    button{
      background-color: #F7DB5D;
    border: none;
    padding: 0.25rem 0.5rem;
    font-family: serif;
    font-size: clamp(20px, 2.3vw, 26px);
    cursor: pointer;
    &:disabled{
      background-color: #F7DB5D;
      opacity: 0.5;
      cursor: not-allowed;
    }
    }
  }
    
</style>
