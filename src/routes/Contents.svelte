<script lang="ts">
	import { menuStateStore } from '../stores';
	import Progression from './Progression.svelte';
	import Collection from './Collection.svelte';
	import CustomScenarios from './CustomScenarios.svelte';
	import Achievements from './Achievements.svelte';
	import Shop from './Shop.svelte';

	// $menuStateStore
	// 0: card collection
	// 1: guide to energies
	// 2: Progression
  // 3: Achievements
	// 4: Readers
	// 5: Custom Scenarios
	// 6: Shop
	$: if ($menuStateStore.change) contents.scrollIntoView();
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
          <option value={0}>Card Collection</option>
          <option value={1}>Guide to Energies</option>
          <option value={2}>Progression</option>
          <option value={3}>Achievements</option>
          <option value={4}>About Readers</option>
          <option value={5}>Custom Scenarios</option>
          <option value={6}>Shop</option>
        </select>
      </div>
    </div>
		<h3>
			{$menuStateStore.value === 0
				? 'Card Collection'
        : $menuStateStore.value === 1
        ? 'Guide to Energies'
        : $menuStateStore.value === 2
        ? 'Progression'
        : $menuStateStore.value === 3
        ? 'Achievements'
        : $menuStateStore.value === 4
        ? 'About Readers'
        : $menuStateStore.value === 5
        ? 'Custom Scenarios'
        : $menuStateStore.value === 6
        ? 'Shop'
				: ''}
		</h3>
		{#if $menuStateStore.value === 0}
			<Collection />
		{/if}
		{#if $menuStateStore.value === 1}
			coming soon...
		{/if}
		{#if $menuStateStore.value === 2}
			<Progression />
		{/if}
		{#if $menuStateStore.value === 3}
			<Achievements />
		{/if}
		{#if $menuStateStore.value === 4}
		coming soon...
		{/if}
		{#if $menuStateStore.value === 5}
		<CustomScenarios />
		{/if}
		{#if $menuStateStore.value === 6}
		<Shop />
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
			margin-top: 1rem;
			font-size: $h2-font-size;
			font-family: $other-font;
			text-align: center;
		}
	}
</style>
