<script lang="ts">
	import Generate from './Generate.svelte';
	import readingScenarios from '$lib/readingScenarios';
	import { fade, fly } from 'svelte/transition';
	import Reading from './Reading.svelte';
	import { timeVariableStore, readingStore } from '../stores';
	import { onMount } from 'svelte';
	import Collection from './Collection.svelte';
	import { afterNavigate } from '$app/navigation';

	// App state
	// state 1: question
	// state 1.1: confirm-question
	// state 2: loading
	// state 3: $readingStore / inaccuracies
	// state 3.1: confirm-inaccuracies
	// state 4: error
	let state = 1;

	// Contents state
	// 0: card collection
	// 1: guide to energies
	// 2: Market
	// 3: Readers
	// 4: Settings
	let contentsState = 0;

	let error: string;


	let readingScenario = readingScenarios.get("2c-pc");
	$: {
		readingScenario = readingScenarios.get($readingStore?.setting);
	}

	let timeVarInterval: NodeJS.Timeout;
	onMount(() => {
		clearInterval(timeVarInterval);
		timeVarInterval = setInterval(() => {
			timeVariableStore.set(($timeVariableStore + 1) % 11);
		}, 500);
	});
</script>

<div class="container">
	<h1 class="screenPadding">
		<span class={$timeVariableStore === 0 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>Call </span>
		<span class={$timeVariableStore === 1 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>upon </span>
		<span class={$timeVariableStore === 2 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>the </span>
		<span class={$timeVariableStore === 3 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>power </span>
		<span class={$timeVariableStore === 4 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>of </span>
		<span class={$timeVariableStore === 5 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>Tarot</span>
	</h1>
	<div class="stacked">
		<div class={state !== 1 ? 'hidden' : ''}>
			<Generate bind:state bind:error />
			<div class="contents screenPadding">
				<div class="contentsMenu">
					<div class="left">
						<button on:click={() => contentsState = 0} class={contentsState === 0 ? "active" : ""}>Card Collection</button>
						<button on:click={() => contentsState = 1} class={contentsState === 1 ? "active" : ""}>Guide to Energies</button>
						<button on:click={() => contentsState = 2} class={contentsState === 2 ? "active" : ""}>Market</button>
					</div>
					<div class="separator"></div>
					<div class="right">
						<button on:click={() => contentsState = 3} class={contentsState === 3 ? "active" : ""}>About Readers</button>
						<button on:click={() => contentsState = 4} class={contentsState === 4 ? "active" : ""}>About Scenarios</button>
					</div>
					
				</div>
				<h3>{contentsState === 0 ? "Card Collection" : contentsState === 1 ? "Guide to Energies" : contentsState === 2 ? "Market" : contentsState === 3 ? "About Readers" : contentsState === 4 ? "About Scenarios" : ""}</h3>
				{#if contentsState === 0}
				<Collection></Collection>
				{/if}
				{#if contentsState === 1 || contentsState === 2 || contentsState === 3 || contentsState === 4}
					coming soon...
				{/if}
			</div>
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
			<!-- Restart button -->
			{error}
			<button on:click={() => state = 1}>Restart</button>
		</div>
	</div>
	
</div>

<style lang="scss">
	.container{
		h1 {
			padding-top: 2rem;
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
		.contents{
			background: $bg2;
			margin-top: 2rem;
			padding-bottom: 4rem;
			.contentsMenu{
				padding-top: 1rem;
				display: grid;
				width: fit-content;
				grid-template-columns: 1fr 3rem 1fr;
				place-items: center;
				margin: auto;
				& .left,.right{
					display: flex;
					flex-direction: column;
				}
				& .left{
					align-items: end;
				}
				& .right{
					place-self: start;
				}
				& .separator{
					grid-area: 1 / 2 / 4 / 3;
					height: 100%;
					width: 1px;
					background: white;
				}
				button{
					width: fit-content;
					background: none;
					border: none;
					color: white;
					font-size: $base-font-size;
					font-family: $other-font;
					text-decoration: underline;
					margin: 0.25rem 0;
					&:hover{
						cursor: pointer;
					}
					&.active{
						text-decoration: none;
						opacity: 0.5;
						pointer-events: none;
					}
				}
			}
			h3{
				margin-top: 1rem;
				font-size: $button-font-size;
				font-family: $other-font;
				text-align: center;
			}
		}
	}
	.error{
		text-align: center;
	}
</style>
