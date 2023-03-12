<script lang="ts">
	import energies from '$lib/energies';
	import Generate from './Generate.svelte';
	import readingScenarios from '$lib/readingScenarios';
	import { fade, fly } from 'svelte/transition';
	import Reading from './Reading.svelte';
	import { timeVariableStore } from '../stores';
	import { onMount } from 'svelte';

	$: console.log($timeVariableStore);
	// App state
	// state 1: question
	// state 1.1: confirm-question
	// state 2: loading
	// state 3: reading / inaccuracies
	// state 3.1: confirm-inaccuracies
	// state 4: error

	let state = 1;

	// Form values
	let question = '';
	let energy = '';
	let information = '';

	// Reading values
	let reading: ReadingType;
	$: console.log(reading);
	let error: string;

	let readingScenario = readingScenarios.get("2c-pc");
	$: {
		console.log(reading?.setting);
		readingScenario = readingScenarios.get(reading?.setting);
		console.log(readingScenario);
	}
	let positions = readingScenario?.positions;

	// Reading state
	let flippedCards: boolean[];
	$: {
		flippedCards = new Array(readingScenario?.positions.length).fill(false);
	}

	let flipCard = (index: number) => {
		flippedCards[index] = !flippedCards[index];
		generateNextReading();
	};

	let handleSubmitInformation = () => {
		fetch('/api/information', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				information: information
			})
		})
			.then((res) => res.json())
			.then((data) => console.log(data.body));
	};

	let generateNextReading = () => {
		fetch('/api/tarotreading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading
			})
		})
			.then((res) => res.json())
			.then((data) => data.body)
			.then((body: { conclusion?: string; reading?: ReadingType }) => {
				if (body.conclusion) {
					console.log(body.conclusion);
					state = 4; // conclusion
					error = body.conclusion;
				}
				if (body.reading) {
					console.log(body.reading);
					state = 3; // reading / inaccuracies
					reading = body.reading;
				}
			});
	};

	let timeVarInterval: NodeJS.Timeout;
	onMount(() => {
		console.log("onMount")
		clearInterval(timeVarInterval);
		timeVarInterval = setInterval(() => {
			timeVariableStore.set(($timeVariableStore + 1) % 4);
		}, 1500);
	});
	
</script>


<div class="container">
	<h1><span class={$timeVariableStore === 0 || $timeVariableStore === 3 ? "illuminated" : ""}>Call upon</span> <span class={$timeVariableStore === 1 || $timeVariableStore === 3 ? "illuminated" : ""}>the power</span> <span class={$timeVariableStore === 2 || $timeVariableStore === 3 ? "illuminated" : ""}>of Tarot</span></h1>
	<div class="stacked">
		<div class={state !== 1 ? 'hidden' : ''}>
			<Generate bind:state bind:energy bind:reading bind:error />
		</div>
	
		<div class={'loading ' + (state !== 2 ? 'hidden' : '')}>
			<p class="energy">Your energy, <span>it is..</span> <span>{energy}</span></p>
			<p class="loading">Let us see what the cards have in store...</p>
		</div>
	
		<div class={state !== 3 ? 'hidden' : ''}>
			{#if reading}
				<Reading bind:reading bind:error bind:state ></Reading>
	
				<!-- <p>Are there any inaccuracies?</p>
				<input type="text" name="information" id="information" bind:value={information} />
				<button on:click={handleSubmitInformation}>+ Add</button> -->
			{/if}
			<Generate bind:state bind:energy bind:reading bind:error />
		</div>
		<div class={state !== 4 ? 'hidden' : ''}>
			{error}
			<Generate bind:state bind:energy bind:reading bind:error />
		</div>
	</div>
</div>

<style lang="scss">
	.container{
		padding-bottom: 3rem;
		h1 {
			text-align: center;
			text-shadow: 0rem 0rem 0.4rem rgba(255, 255, 255, 0.37);
			span {
				transition: all 0.25s ease-in-out;
				&.illuminated {
					text-shadow: -0.2rem 0.2rem 0.6rem rgba(243, 221, 154, 0.432),
						0.2rem -0.2rem 0.4rem rgba(45, 135, 177, 0.6);
				}
			}
		}
		.loading{
			margin-top: 2rem;
			text-align: center;
		}
	}
</style>
