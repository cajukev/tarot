<script lang="ts">
	import energies from '$lib/energies';
	import readingScenarios from '$lib/readingScenarios';
	import type { ChatCompletionResponseMessage } from 'openai';
	import { onMount } from 'svelte';
	import {
		readingStore,
		conclusionStore,
		timeVariableStore,
		settingStore,
		flippedCardsStore,
		flippedCardStore,
		flipLockStore
	} from '../stores';

	export let state: number;
	$: console.log('state', state);
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
		$readingStore.cards = cards;
		$readingStore.question = question;
	}

	$: {
		console.log($flippedCardsStore);
		cardFlip();
	}

	$: {
		console.log($flippedCardStore);
		if ($flippedCardStore !== -1) readCard($flippedCardStore);
	}

	let cardFlip = () => {
		let cardNb = 0;
		if ($flippedCardsStore) {
			$flippedCardsStore.forEach((value, key) => {
				if (value) {
					cardNb++;
				}
			});
			if (cardNb > 0) {
				readcards($readingStore.cards.slice(cardNb - 1, $flippedCardsStore.length));
			}
		}
	};

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
		$readingStore.conclusion = '';
		$readingStore.cards = [];
		flippedCardStore.set(-1)
		$flippedCardsStore = readingScenarios.get(setting)?.positions.map(() => false) || [];

		fetch('/api/draw', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: question,
				energy: energy,
				setting: setting
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
						$readingStore.energy = energy;
						$readingStore.setting = setting;
						conclusion = '';
						cards = body.cards;
						cards = [...cards];
						state = 3; // reading
						//readcards(cards);
					}
				}
			);
	};

	let readCard = (index: number) => {
		let card = $readingStore.cards[index];
		console.log(card);
		fetch('/api/readcard', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: $readingStore.question,
				instruction: readingScenarios.get(setting)?.instructions[index],
				example: readingScenarios.get(setting)?.example,
				cardTextLength: readingScenarios.get(setting)?.cardTextLength,
				energy: $readingStore.energy,
				setting: $readingStore.setting,
				card: card.title,
				reversed: card.reversed,
				position: card.position
			})
		}).then(async (res) => {
			const reader = res.body?.getReader();

			while (true && reader) {
				const { done, value } = await reader.read();
				console.log(done, value);
				const text = new TextDecoder('utf-8').decode(value);
				if (text) {
					card.reading = text;
					cards[index] = card;
					cards = [...cards];
				}
				if (done) {
					flipLockStore.set(false);
					let cardReadings = cards.map((card) => card.reading).filter((reading) => reading);
					if (cardReadings.length === cards.length && readingScenarios.get(setting)?.conclusion) {
						fetch('/api/conclusion', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								readings: cardReadings,
								question: question,
								energy: energy
							})
						}).then(async (res) => {
							const reader = res.body?.getReader();

							while (true && reader) {
								const { done, value } = await reader.read();
								console.log(done, value);
								const text = new TextDecoder('utf-8').decode(value);
								if (text) $readingStore.conclusion = text;
								if (done) break;
							}
						});
					}
					break;
				}
			}
		});
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
					question: question,
					energy: energy
				})
			}).then(async (res) => {
				const reader = res.body?.getReader();

				while (true && reader) {
					const { done, value } = await reader.read();
					console.log(done, value);
					const text = new TextDecoder('utf-8').decode(value);
					if (text) $readingStore.conclusion = text;
					if (done) break;
				}
			});
		} else {
			if (cardsToRead.length === 0) {
				console.log('no conclusion');
				return;
			}
			let card = cardsToRead[0];
			let index = cards.indexOf(card);
			console.log('reading card', index);
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
					position: card.position
				})
			}).then(async (res) => {
				const reader = res.body?.getReader();

				while (true && reader) {
					const { done, value } = await reader.read();
					console.log(done, value);
					const text = new TextDecoder('utf-8').decode(value);
					if (text) {
						card.reading = text;
						cards[index] = card;
						cards = [...cards];
					}
					if (done) {
						if (cardsToRead.length === 1) {
							// Conclusion
							readcards(cardsToRead.slice(1));
						}
						break;
					}
				}
			});
		}
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
			width: 16rem;
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
