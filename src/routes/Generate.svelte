<script lang="ts">
	import energies from '$lib/energies';
	import readingScenarios from '$lib/readingScenarios';
	import type { ChatCompletionResponseMessage } from 'openai';
	import { onMount } from 'svelte';
	import { readingStore, conclusionStore, timeVariableStore, settingStore } from '../stores';

	export let state: number;
	export let energy = '';
	export let error = '';

	let innerState = 1;

	let generateButtonWrapper: HTMLDivElement;
	let pressedSegment = 0;

	let setting = '1c';
	$: settingStore.set(setting);

	let cards: Card[] = [];
	let question = '';
	let conclusion = '';
	$: {
		console.log(cards, question);
		$readingStore.cards = cards;
		$readingStore.question = question;
		$readingStore.conclusion = conclusion;
	}

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
		handleSubmit2();
	};

	let handleSubmit2 = () => {
		state = 2; // loading
		innerState = 1;
		energy = energies[pressedSegment - 1][$timeVariableStore];

		fetch('/api/draw', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: question,
				energy: energy,
				setting: setting,
			})
		})
			.then((res) => res.json())
			.then((data) => data.body)
			.then(
				(body: {
					cards?: { title: string; reversed: boolean; position: string }[];
					error?: string;
				}) => {
					console.log(body);
					if (body.error) {
						state = 4;
						error = body.error;
						return;
					}
					if (body.cards) {
						cards = body.cards;
						cards = [...cards];
						state = 3; // reading
						readcards(cards);
					}
				}
			);
	};

	let readcards = (cardsToRead: Card[]) => {
		let cardTexts = cards.map((card) => card.reading).filter((reading) => reading);
		if (cardsToRead.length === 0 && cards.length > 1 && readingScenarios.get(setting)?.conclusion) {
			fetch('/api/conclusion', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					readings: cardTexts,
				})
			})
				.then((res) => res.json())
				.then((data) => data.body)
				.then((body: { conclusion: string }) => {
					conclusion = body.conclusion;
					console.log(conclusion);
				});
			return;
		}else{
			if(cardsToRead.length === 0){
				return;
			}
			let card = cardsToRead[0];
			let index = cards.indexOf(card);
			fetch('/api/readcard', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question: question,
					instruction: readingScenarios.get(setting)?.instructions[index],
					example: readingScenarios.get(setting)?.example,
					cardTextLength: readingScenarios.get(setting)?.cardTextLength,
					energy: energy,
					setting: setting,
					card: card.title,
					reversed: card.reversed,
					position: card.position,
					cardTexts: cardTexts
				})
			})
				.then((res) => res.json())
				.then((data) => data.body)
				.then((body: { reading: string }) => {
					cardTexts.push(body.reading);
					console.log(body.reading);
					cards[index].reading = body.reading;
					cards = [...cards];
					readcards(cardsToRead.slice(1));
				});
		}
	};

	// let handleSubmit = () => {
	// 	state = 2; // loading
	// 	innerState = 1;
	// 	energy = energies[pressedSegment - 1][$timeVariableStore];
	// 	reading = {
	// 		energy: energy,
	// 		question: question,
	// 		cards: [],
	// 		conclusion: '',
	// 		setting: setting
	// 	};
	// 	reading.setting = setting;
	// 	fetch('/api/tarotreading', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			reading
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => data.body)
	// 		.then((body: { conclusion?: string; reading?: ReadingType }) => {
	// 			if (body.conclusion) {
	// 				console.log(body.conclusion);
	// 				state = 4; // conclusion
	// 				error = body.conclusion;
	// 				conclusionStore.set(body.conclusion);
	// 			}
	// 			if (body.reading) {
	// 				console.log(body.reading);
	// 				state = 3; // reading / inaccuracies
	// 				reading = body.reading;
	// 				readingStore.set(reading);
	// 			}
	// 		});
	// };
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
