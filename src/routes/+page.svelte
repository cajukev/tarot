<script lang="ts">
	import Generate from './Generate.svelte';
	import Reading from './Reading.svelte';
	import { readingStore } from '../stores';
	import { page } from '$app/stores';
	import Landing from './Landing.svelte';
	import Contents from './Contents.svelte';
	
	// App state
	let state = 1;
	// state 1: Setup
	// state 2: Loading
	// state 3: Reading
	// state 4: Error

	let error: string;

</script>

<div class="container">
	{#if $page.data?.profile }
	<div class="stacked">
		<div class={state !== 1 ? 'hidden' : ''}>
			<Generate bind:state bind:error />
			
		</div>
	
		<div class={'loading sidePadding ' + (state !== 2 ? 'hidden' : '')}>
			<p class="energy">Your energy, <span>it reads..</span> <span>{$readingStore.energy}</span></p>
			<p class="loading">Let us see what the cards have in store...</p>
		</div>
	
		<div class={'sidePadding ' + (state !== 3 ? 'hidden' : '')}>
			{#if $readingStore}
				<Reading bind:state ></Reading>
				<!-- <p>Are there any inaccuracies?</p>
				<input type="text" name="information" id="information" bind:value={information} />
				<button on:click={handleSubmitInformation}>+ Add</button> -->
			{/if}
		</div>
		<div class={'error sidePadding ' + (state !== 4 ? 'hidden ' : '')}>
			{error}
			<button on:click={() => state = 1}>Restart</button>
		</div>
	</div>
	<Contents />
	{:else}
	<!-- User not logged in -->
	<Landing/>
	{/if}
	
</div>

<style lang="scss">
	.container{
		.stacked{
			min-height: 100vh;
		}
		.loading{
			margin-top: 2rem;
			text-align: center;
		}
	}
	.error{
		margin-top: 2rem;
		text-align: center;
	}
</style>
