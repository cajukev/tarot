<script lang="ts">
	import { menuStateStore } from '../stores';
	import Progression from './Progression.svelte';
	import Collection from './Collection.svelte';
	import CustomScenarios from './CustomScenarios.svelte';
	import Achievements from './Achievements.svelte';
	import Shop from './Shop.svelte';
	import Readers from './Readers.svelte';
	import EnergiesGuide from './EnergiesGuide.svelte';

	// $menuStateStore
	// 0: card collection
	// 1: guide to energies
	// 2: Progression
  // 3: Achievements
	// 4: Readers
	// 5: Custom Scenarios
	// 6: Shop
	$: if ($menuStateStore.change) contents.scrollIntoView();

	let menuItems = [
		{ name: 'Card Collection', component: Collection },
		{ name: 'Guide to Energies', component: EnergiesGuide },
		{ name: 'Progression', component: Progression },
		{ name: 'Achievements', component: Achievements },
		{ name: 'About Readers', component: Readers },
		{ name: 'Custom Scenarios', component: CustomScenarios },
		{ name: 'Shop', component: Shop }
	];

	let contents: HTMLElement;

  let menuValue: number;
</script>

<div class="container">
	<div bind:this={contents} class="contents screenPadding">
    <div class="bp1">
      <div class="contentsMenu">
        <div class="left">
          <button
            on:click={() => ($menuStateStore = { value: 0, change: false })}
            class={$menuStateStore.value === 0 ? 'active' : ''}>Card Collection</button
          >
          <button
            on:click={() => ($menuStateStore = { value: 1, change: false })}
            class={$menuStateStore.value === 1 ? 'active' : ''}>Guide to Energies</button
          >
          <button
            on:click={() => ($menuStateStore = { value: 2, change: false })}
            class={$menuStateStore.value === 2 ? 'active' : ''}>Progression</button
          >
          <button
            on:click={() => ($menuStateStore = { value: 3, change: false })}
            class={$menuStateStore.value === 3 ? 'active' : ''}>Achievements</button
          >
        </div>
        <div class="separator" />
        <div class="right">
          <button
            on:click={() => ($menuStateStore = { value: 4, change: false })}
            class={$menuStateStore.value === 4 ? 'active' : ''}>About Readers</button
          >
          <button
            on:click={() => ($menuStateStore = { value: 5, change: false })}
            class={$menuStateStore.value === 5 ? 'active' : ''}>Custom Scenarios</button
          >
          <button
            on:click={() => ($menuStateStore = { value: 6, change: false })}
            class={$menuStateStore.value === 6 ? 'active' : ''}>Shop</button
          >
        </div>
      </div>
    </div>
    <div class="ubp1">
      <div class="mobileMenu">
        <select bind:value={menuValue} on:change={()=>{$menuStateStore.value = menuValue}}>
					{#each menuItems as item, i}
						<option value={i}>{item.name}</option>
					{/each}
        </select>
      </div>
    </div>

		<h3>
			{ menuItems[$menuStateStore.value].name }
		</h3>

		{#if menuItems[$menuStateStore.value].component}
			<svelte:component this={menuItems[$menuStateStore.value].component} />
		{/if}
		
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
		h3 {
			margin-top: 1.5rem;
			font-size: $h2-font-size;
			font-family: $other-font;
			text-align: center;
			padding-bottom: 2rem;
		}
	}
</style>
