<script lang="ts">
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
		{ name: 'Card Collection', component: Collection },
		{ name: 'Guide to Energies', component: EnergiesGuide },
		{ name: 'Progression', component: Progression },
		{ name: 'Achievements', component: Achievements },
		{ name: 'About Readers', component: Readers },
		{ name: 'Custom Spreads', component: CustomSpreads },
		{ name: 'Shop', component: Shop },
		{ name: 'Customize', component: Customize}
		
	];

	let contents: HTMLElement;

  let menuValue = 0;
</script>

<div class="container">
	<div bind:this={contents} class="contents screenPadding">
    <div class="bp1">
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
    </div>

		{#each menuItems as item, i}
			{#if i === menuValue}
			<div in:fade="{{duration:150, delay: 150}}" out:fade="{{duration:150, delay: 0}}">

				<h1>
					{ item.name }
				</h1>
				<div >
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
		.contentsMenu {
			padding-top: 1rem;
			display: grid;
			width: fit-content;
			grid-template-columns: 1fr 3rem 1fr;
			place-items: center;
			margin: auto;
			& .left,
			.right {
				display: flex;
				flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
			}
			& .left {
				align-items: end;
			}
			& .right {
				place-self: start;
			}
			& .separator {
				grid-area: 1 / 2 / 4 / 3;
				height: 100%;
				width: 1px;
				background: white;
			}
			button {
				width: fit-content;
				background: none;
				border: none;
				color: white;
				font-size: $base-font-size;
				font-family: $other-font;
				text-decoration: underline;
				margin: 0.25rem 0;
				&:hover {
					cursor: pointer;
				}
				&.active {
					text-decoration: none;
					opacity: 0.5;
					pointer-events: none;
				}
			}
		}
    .mobileMenu{
      padding-top: 2rem;
      padding-bottom: 1rem;
    }
		h1 {
			margin-top: 1.5rem;
			text-align: center;
			padding-bottom: 2rem;
		}
	}
</style>
