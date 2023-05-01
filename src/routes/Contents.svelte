<script lang="ts">
	import { page } from '$app/stores';
	import { menuStateStore } from '../stores';
	import Progression from './Progression.svelte';
	import Collection from './Collection.svelte';
	import CustomSpreads from './CustomSpreads.svelte';
	import Achievements from './Achievements.svelte';
	import Shop from './Shop.svelte';
	import Readers from './Readers.svelte';
	import EnergiesGuide from './EnergiesGuide.svelte';
	import { fade } from 'svelte/transition';
	import Customize from './Customize.svelte';
	import ItemList from './ItemList.svelte';
	import { onMount } from 'svelte';
	import { unlocks } from '$lib/unlocks';
	// $menuStateStore
	// 0: card collection
	// 1: guide to energies
	// 2: Progression
  // 3: Achievements
	// 4: Readers
	// 5: Custom Spreads
	// 6: Shop
	$: if ($menuStateStore.change){
		contents.scrollIntoView();
		menuValue = $menuStateStore.value;
	}

	let menuItems = [
		{ name: 'Card Collection', component: Collection, img: '/menuOptions/Collection.svg' },
		{ name: 'Guide to Energies', component: EnergiesGuide, img: '/menuOptions/Guide_To_Energies.svg' },
		{ name: 'Progression', component: Progression, img: '/menuOptions/Progression.svg' },
		{ name: 'About Readers', component: Readers, img: '/menuOptions/Readers.svg' },
		{ name: 'Custom Spreads', component: CustomSpreads, img: '/menuOptions/Custom_Spreads.svg', exp: unlocks.get('custom')!.exp },
		{ name: 'Shop', component: Shop, img: '/menuOptions/Shop.svg' },
		{ name: 'Customize', component: Customize, img: '/menuOptions/Customize.svg'}
	];

	let navigate = (index: number) => {
		menuValue = index;
		setupItemList();
	};

	let itemList: ListItem[] = [
	] 

	let setupItemList = () => {
		itemList = [];
		menuItems.forEach((item, i) => {
			if(item.exp && item.exp > $page.data.profile.data.experience) return;
			itemList.push({
				id: i,
				name: menuItems[i].name,
				img: menuItems[i].img,
				action: () => {
					navigate(i);
				},
				selected: i === menuValue
			});
		});
	}

	onMount(() => {
		menuValue = 0
		setupItemList();
	});


	let contents: HTMLElement;

  let menuValue: number;
</script>

<div class="container">
	<div bind:this={contents} class="contents ">
		<div class="contentsMenuWrapper" >
			<p class="info">Menu Of Contents</p>
			<div class="contentsMenu">
				<ItemList bind:items={itemList} />
			</div>
		</div>
    <!-- <div class="bp1">
			<div class="contentsMenu">
        <div class="left">
          <button
            on:click={() => (menuValue = 0)}
            class={menuValue === 0 ? 'active' : ''}>Card Collection</button
          >
          <button
            on:click={() => (menuValue = 1)}
            class={menuValue === 1 ? 'active' : ''}>Guide to Energies</button
          >
          <button
            on:click={() => (menuValue = 2)}
            class={menuValue === 2 ? 'active' : ''}>Progression</button
          >
          <button
            on:click={() => (menuValue = 3)}
            class={menuValue === 3 ? 'active' : ''}>Achievements</button
          >
        </div>
        <div class="separator" />
        <div class="right">
					<button
            on:click={() => (menuValue = 7)}
            class={menuValue === 7 ? 'active' : ''}>Customize</button
          >
          <button
            on:click={() => (menuValue = 4)}
            class={menuValue === 4 ? 'active' : ''}>About Readers</button
          >
          <button
            on:click={() => (menuValue = 5)}
            class={menuValue === 5 ? 'active' : ''}>Custom Spreads</button
          >
          <button
            on:click={() => (menuValue = 6)}
            class={menuValue === 6 ? 'active' : ''}>Shop</button
          >
        </div>
      </div>
    </div>
    <div class="ubp1">
      <div class="mobileMenu">
        <select bind:value={$menuStateStore.value} on:change={(e)=>{menuValue = parseInt(e.currentTarget.value)}}>
					{#each menuItems as item, i}
						<option value={i}>{item.name}</option>
					{/each}
        </select>
      </div>
    </div> -->

		{#each menuItems as item, i}
			{#if i === menuValue}
			<div in:fade="{{duration:150, delay: 150}}" out:fade="{{duration:150, delay: 0}}">

				<h1>
					{ item.name }
				</h1>
				<div class="screenPadding">
					<svelte:component this={item.component} />
			</div>
				</div>
			{/if}
		{/each}
		
	</div>
</div>

<style lang="scss">
	.contents {
		background: $bg2;
		margin-top: 2rem;
		padding-bottom: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
		.contentsMenuWrapper{
			width: 100%;
			min-height: 15rem;
			background-color: #111C26;
			padding-top: 1rem;
			text-align: center;
		}
		.contentsMenu {
			animation: flyIn 0.3s 1s ease-out forwards;
			opacity: 0;
			display: inline-flex;
			justify-content: center;
			margin: auto;
		}
		h1 {
			margin-top: 1.5rem;
			text-align: center;
			padding-bottom: 2rem;
		}
	}

	@keyframes flyIn {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
