<script lang="ts">
	import energies from '$lib/energies';
	import readingScenarios from '$lib/readingScenarios';
	import { onMount } from 'svelte';
	import { readingStore, conclusionStore, timeVariableStore, settingStore } from '../stores';

	export let state: number;
	export let energy = '';
	export let reading: ReadingType;
	export let error = '';

	let innerState = 1;

	// Form values
	let question = '';

	let generateButtonWrapper: HTMLDivElement;
	let pressedSegment = 0;

	let setting = '1c';
	$: console.log(setting);
	$: settingStore.set(setting);

	let mouseoverSegment = (segment: number) => {
		switch (segment) {
			case 1:
				generateButtonWrapper.style.transform =
					'rotatey(10deg) rotatex(-10deg) translateX(-0.5rem)';
				break;
			case 2:
				generateButtonWrapper.style.transform =
					'rotatey(3deg) rotatex(-10deg) translateX(-0.25rem)';
				break;
			case 3:
				generateButtonWrapper.style.transform =
					'rotatey(-3deg) rotatex(-10deg) translateX(0.25rem)';
				break;
			case 4:
				generateButtonWrapper.style.transform =
					'rotatey(-10deg) rotatex(-10deg) translateX(0.5rem)';
				break;
		}
	};
	let mouseExit = () => {
		generateButtonWrapper.style.transform = 'rotate(0deg)';
	};
	let clickSegment = (segment: number) => {
		pressedSegment = segment;
		innerState = 2;
		handleSubmit();
	};
	let handleSubmit = () => {
		state = 2; // loading
		innerState = 1;
		energy = energies[pressedSegment - 1][$timeVariableStore];
		reading = {
			energy: energy,
			question: question,
			cards: [],
			conclusion: '',
			setting: setting
		};
		reading.setting = setting;
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
					conclusionStore.set(body.conclusion);
				}
				if (body.reading) {
					console.log(body.reading);
					state = 3; // reading / inaccuracies
					reading = body.reading;
					readingStore.set(reading);
				}
			});
	};
</script>

<div class="stacked container">
	<div class={'input ' + (innerState !== 1 ? 'hidden' : '')}>
		<select name="type" id="type" bind:value={setting}>
			{#each Array.from(readingScenarios).map(([name, setting]) => ({ name, setting })) as scenario}
				<option value={scenario.name}>{scenario.setting.name}</option>
			{/each}
		</select>
		<input bind:value={question} type="text" name="question" id="question" />
		<div bind:this={generateButtonWrapper} class="generateButtonWrapper stacked">
			<div class="generateButton" on:mouseleave={mouseExit} on:touchend={mouseExit}>
				<button
					type="button"
					on:mouseover|preventDefault={() => mouseoverSegment(1)}
					on:focus={() => mouseoverSegment(1)}
					on:touchstart={() => mouseoverSegment(1)}
					on:touchmove={() => mouseoverSegment(1)}
					on:click|preventDefault={() => clickSegment(1)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(2)}
					on:focus={() => mouseoverSegment(2)}
					on:touchstart={() => mouseoverSegment(2)}
					on:touchmove={() => mouseoverSegment(2)}
					on:click={() => clickSegment(2)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(3)}
					on:focus={() => mouseoverSegment(3)}
					on:touchstart={() => mouseoverSegment(3)}
					on:touchmove={() => mouseoverSegment(3)}
					on:click={() => clickSegment(3)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(4)}
					on:focus={() => mouseoverSegment(4)}
					on:touchstart={() => mouseoverSegment(4)}
					on:touchmove={() => mouseoverSegment(4)}
					on:click={() => clickSegment(4)}
				/>
			</div>
			<p>Tell me my fortune</p>
		</div>
	</div>
</div>

<style lang="scss">
	.stacked.container {
		margin-top: 2rem;
		text-align: center;
	}
	.input {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		& input {
			width: 15rem;
			height: 2.5rem;
			margin-bottom: 1rem;
		}
	}
	.generateButtonWrapper {
		overflow: visible;
		transition: all 0.5s ease-in-out;
		perspective: 100px;
		.generateButton {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			width: 20rem;
			height: 5rem;
			& button {
				width: 100%;
				height: 100%;
				background-color: #000;
				border: none;
				&:hover {
					// background-color: rgb(14, 13, 13);
				}
			}
		}
		& p {
			pointer-events: none;
			place-self: center;
			font-size: $subheader-font-size;
			transform: translateZ(0);
		}
	}
</style>
