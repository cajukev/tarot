<script lang="ts">
	import Generate from './Generate.svelte';
	import Reading from './Reading.svelte';
	import { readingStore } from '../stores';
	import { page } from '$app/stores';
	import Landing from './Landing.svelte';
	import Contents from './Contents.svelte';
	import Indicators from './Indicators.svelte';
	
	// App state
	let state = 1;
	// state 1: Setup
	// state 2: Loading
	// state 3: Reading
	// state 4: Error

	let error: string;

</script>

<div class="container">
	{#if !$page.data?.profile }
	<div  class="center-content mt-2">
		<a href="/login"><h5><button class="action login">Login or sign up</button></h5></a>
		<p class="info mt-1">... to unlock more spreads, cards and readers!</p>
	</div>
	{/if}
	<div class="stacked">
		<div class={state !== 1 ? 'hidden' : ''}>
			<Generate bind:state bind:error />
			
		</div>
	
		<div class={'loading sidePadding ' + (state !== 2 ? 'hidden' : '')}>
			{#if $readingStore.energy}
				<p class="energy">Your energy, <span>it reads..</span> <span>{$readingStore.energy}</span></p>
			{/if}
			<p class="loading">Validating your question...</p>
		</div>
	
		<div class={'' + (state !== 3 ? 'hidden' : '')}>
			{#if $readingStore}
				<Reading bind:state ></Reading>
			{/if}
		</div>
		<div class={'error sidePadding ' + (state !== 4 ? 'hidden ' : '')}>
			{error}
			<button on:click={() => state = 1}>Restart</button>
		</div>
	</div>
	
	<Contents />

	{#if $page.data?.profile}
	<div class="indicators">
		<Indicators></Indicators>
	</div>
	{/if}
	
</div>

<style lang="scss">
	.container{
		.loading{
			margin-top: 2rem;
			text-align: center;
		}
	}
	.error{
		margin-top: 2rem;
		text-align: center;
	}
	.indicators{
		position: fixed;
		top: 1rem;
		left: 1rem;
		width: fit-content;
	}
	.login{
		font-size: $h4-font-size;
	}
	.center-content{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
