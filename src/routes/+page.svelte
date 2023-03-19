<script lang="ts">
	import { energies } from '$lib/energies';
	import Generate from './Generate.svelte';
	import readingScenarios from '$lib/readingScenarios';
	import { fade, fly } from 'svelte/transition';
	import Reading from './Reading.svelte';
	import { timeVariableStore, readingStore } from '../stores';
	import { onMount } from 'svelte';
	import Collection from './Collection.svelte';

	// App state
	// state 1: question
	// state 1.1: confirm-question
	// state 2: loading
	// state 3: $readingStore / inaccuracies
	// state 3.1: confirm-inaccuracies
	// state 4: error

	let state = 1;

	// Form values
	let question = '';
	let energy = '';
	let information = '';

	let error: string;


	let readingScenario = readingScenarios.get("2c-pc");
	$: {
		readingScenario = readingScenarios.get($readingStore?.setting);
	}

	let timeVarInterval: NodeJS.Timeout;
	onMount(() => {
		console.log("onMount")
		clearInterval(timeVarInterval);
		timeVarInterval = setInterval(() => {
			timeVariableStore.set(($timeVariableStore + 1) % 4);
		}, 1000);
	});
	
</script>

<div class="container">
	<h1 class="sidePadding"><span class={$timeVariableStore === 0 || $timeVariableStore === 3 ? "illuminated" : ""}>Call upon</span> <span class={$timeVariableStore === 1 || $timeVariableStore === 3 ? "illuminated" : ""}>the power</span> <span class={$timeVariableStore === 2 || $timeVariableStore === 3 ? "illuminated" : ""}>of Tarot</span></h1>
	<div class="stacked">
		<div class={state !== 1 ? 'hidden' : ''}>
			<Generate bind:state bind:energy bind:error />
			<Collection></Collection>
		</div>
	
		<div class={'loading sidePadding ' + (state !== 2 ? 'hidden' : '')}>
			<p class="energy">Your energy, <span>it reads..</span> <span>{energy}</span></p>
			<p class="loading">Let us see what the cards have in store...</p>
		</div>
	
		<div class={'sidePadding ' + (state !== 3 ? 'hidden' : '')}>
			{#if $readingStore}
				<Reading bind:state ></Reading>
	
				<!-- <p>Are there any inaccuracies?</p>
				<input type="text" name="information" id="information" bind:value={information} />
				<button on:click={handleSubmitInformation}>+ Add</button> -->
			{/if}
			<!-- Restart button -->
		</div>
		<div class={'error sidePadding ' + (state !== 4 ? 'hidden ' : '')}>
			<!-- Restart button -->
			{error}
			<button on:click={() => state = 1}>Restart</button>
		</div>
	</div>
	
</div>

<style lang="scss">
	.container{
		padding-bottom: 3rem;
		h1 {
			text-align: center;
			text-shadow: 0rem 0rem 0.4rem rgba(255, 255, 255, 0.137);
			span {
				transition: all 0.25s ease-in-out;
				&.illuminated {
					text-shadow: -0.2rem 0.2rem 0.6rem rgba(235, 228, 209, 0.637),
						0.2rem -0.2rem 0.4rem rgba(45, 135, 177, 0.822);
				}
			}
		}
		.loading{
			margin-top: 2rem;
			text-align: center;
		}
	}
	.error{
		text-align: center;
	}
</style>
