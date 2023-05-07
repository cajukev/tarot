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
	import Customization from './Customization.svelte';
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
		// console.log('menuStateStore changed', $menuStateStore.value);
		menuValue = $menuStateStore.value;
		setupItemList();
		setTimeout(() => {
			contents.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
		}, 151);
	}

	let menuItems = [
		{ name: 'Card Collection', component: Collection, img: '/menuOptions/Collection.svg' },
		{ name: 'Guide to Energies', component: EnergiesGuide, img: '/menuOptions/Guide_To_Energies.svg' },
		{ name: 'Progression', component: Progression, img: '/menuOptions/Progression.svg' },
		{ name: 'About Readers', component: Readers, img: '/menuOptions/Readers.svg' },
		{ name: 'Custom Spreads', component: CustomSpreads, img: '/menuOptions/Custom_Spreads.svg', exp: unlocks.get('custom')!.exp },
		{ name: 'Shop', component: Shop, img: '/menuOptions/Shop.svg' },
		{ name: 'Customization', component: Customization, img: '/menuOptions/Customization.svg'}
	];

	let navigate = (index: number) => {
		$menuStateStore = { value: index, change: false };
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
		<div class="stacked">
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
</div>

<style lang="scss">
	.contents {
		// background: $bg2;
		margin-top: 2rem;
		padding-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
		.contentsMenuWrapper{
			width: 100%;
			min-height: 15rem;
			background-color: #111C26;
			padding-top: 1rem;
			text-align: center;
			box-shadow: 0px 0px 1rem 0px rgba(7, 13, 17, 0.75);
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
