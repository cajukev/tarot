<script lang="ts">
	import type { CollectionCard } from '$lib/cards';
	import { cards } from '$lib/cards';
	import { energyList, energyGrid, energyMap } from '$lib/energies';
	import readingScenarios from '$lib/readingScenarios';
	import type { ChatCompletionResponseMessage } from 'openai';
	import { onMount } from 'svelte';
	import characters from '$lib/characters';
	import {
		readingStore,
		timeVariableStore,
		settingStore,
		flippedCardsStore,
		cardFlipStore,
		flipLockStore
	} from '../stores';

	export let state: number;
	export let energy = '';
	export let error = '';

	let innerState = 1;

	let generateButtonWrapper: HTMLDivElement;
	let pressedSegment = 0;

	let setting = 'qa';
	$: settingStore.set(setting);
	settingStore.set(setting);

	let character = 'Brother Oak';

	let drawnCards: CollectionCard[] = [];
	let question = '';

	let conclusion = '';

	let scrollVar = 1;
	let oldScroll = 0;
	onMount(() => {
		window.onscroll = function () {
			scrollVar = oldScroll > scrollY ? 1 : 2;
			oldScroll = scrollY;
		};
	});

	$: {
		$readingStore.cards = drawnCards;
		$readingStore.question = question;
	}

	$: {
		// if ($cardFlipStore !== -1) readCard($cardFlipStore);
	}

	$: {
		console.log('flippedCardsStore', $flippedCardsStore);
		cardFlipped();
	}

	let cardFlipped = () => {
		if (
			$flippedCardsStore?.filter((card) => card).length === $flippedCardsStore?.length &&
			$readingStore.cards.length > 0
		) {
			console.log(
				'all cards flipped',
				$flippedCardsStore?.filter((card) => card).length,
				$readingStore.cards
			);
			getReading();
		}
	};

	let mouseoverSegment = (segment: number) => {
		switch (segment) {
			case 1:
				generateButtonWrapper.style.transform =
					'rotatey(10deg) rotatex(-15deg) translateX(-0.5rem)';
				break;
			case 2:
				generateButtonWrapper.style.transform =
					'rotatey(3deg) rotatex(-15deg) translateX(-0.25rem)';
				break;
			case 3:
				generateButtonWrapper.style.transform = 'rotatey(0) rotatex(-15deg) translateX(0rem)';
				break;
			case 4:
				generateButtonWrapper.style.transform =
					'rotatey(-3deg) rotatex(-15deg) translateX(0.25rem)';
				break;
			case 5:
				generateButtonWrapper.style.transform =
					'rotatey(-10deg) rotatex(-15deg) translateX(0.5rem)';
				break;
			case 6:
				generateButtonWrapper.style.transform = 'rotatey(10deg) rotatex(15deg) translateX(-0.5rem)';
				break;
			case 7:
				generateButtonWrapper.style.transform = 'rotatey(3deg) rotatex(15deg) translateX(-0.25rem)';
				break;
			case 8:
				generateButtonWrapper.style.transform = 'rotatey(0) rotatex(15deg) translateX(0rem)';
				break;
			case 9:
				generateButtonWrapper.style.transform = 'rotatey(-3deg) rotatex(15deg) translateX(0.25rem)';
				break;
			case 10:
				generateButtonWrapper.style.transform = 'rotatey(-10deg) rotatex(15deg) translateX(0.5rem)';
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
		conclusion = '';
		console.log(
			energyGrid[pressedSegment - 1][scrollVar][$timeVariableStore] + 1
		);
		energy =
			energyMap.get(
				energyGrid[pressedSegment - 1][scrollVar][$timeVariableStore] + 1
			)?.value || '';
		$readingStore.conclusion = '';
		$readingStore.cards = [];
		cardFlipStore.set(-1);
		$flippedCardsStore = readingScenarios.get(setting)?.positions.map(() => false) || [];

		/**
		 *
		 * NEW READING PARADIGM
		 * IMPLEMENT MEANING INTO GPT4 AND READING
		 *
		 * MINIMIZES API CALLS
		 * LEVERAGES GPT4
		 * DRAW ALL CARDS THEN GIVE GPT4 READING
		 * INJECT CARD TEXT INTO GPT4
		 * GPT4 RETURNS READING AS STREAM
		 *
		 * MEANING IS DISPLAYED TO USER
		 *
		 * 2 CALLS INSTEAD OF 2 / 3 / 5
		 * HIGHER QUALITY RESPONSES
		 *
		 * API 15X COST OF 3.5-TURBO
		 *
		 *
		 */

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
					cards?: { name: string; reversed: boolean; position: string }[];
					error?: string;
				}) => {
					if (body.error) {
						state = 4;
						error = body.error;
						console.log(error);
						return;
					}
					if (body.cards) {
						$readingStore.energy = energy;
						$readingStore.setting = setting;
						conclusion = '';
						let drawnCards = body.cards;
						console.log(drawnCards);
						let returnCards: CollectionCard[] = [];
						drawnCards.forEach((drawnCard) => {
							for (let [key, value] of cards.entries()) {
								value.forEach((card) => {
									console.log(card.name === drawnCard.name);
									if (drawnCard.name === card.name) {
										card.reversed = drawnCard.reversed;
										returnCards.push(card);
										console.log(card);
									}
								});
							}
						});
						console.log(returnCards);
						$readingStore.cards = returnCards;
						state = 3;
					}
				}
			);
	};

	let getReading = () => {
		$readingStore.character = character;
		fetch('/api/tarotreading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore
			})
		}).then(async (res) => {
			const reader = res.body?.getReader();

			while (true && reader) {
				const { done, value } = await reader.read();
				const text = new TextDecoder('utf-8').decode(value);
				if (text) $readingStore.conclusion = text;
				if (done) break;
			}
		});
	};

	let readCards = () => {
		fetch('/api/tarotreading');
	};

	// let readCard = (index: number) => {
	// 	let card = $readingStore.cards[index];
	// 	fetch('/api/readcard', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			question: $readingStore.question,
	// 			instruction: readingScenarios.get(setting)?.instructions[index],
	// 			example: readingScenarios.get(setting)?.example,
	// 			cardTextLength: readingScenarios.get(setting)?.cardTextLength,
	// 			energy: $readingStore.energy,
	// 			setting: $readingStore.setting,
	// 			card: card.name,
	// 			reversed: card.reversed,
	// 			position: card.position
	// 		})
	// 	}).then(async (res) => {
	// 		const reader = res.body?.getReader();

	// 		while (true && reader) {
	// 			const { done, value } = await reader.read();
	// 			const text = new TextDecoder('utf-8').decode(value);
	// 			if (text) {
	// 				card.reading = text;
	// 				cards[index] = card;
	// 				cards = [...cards];
	// 			}
	// 			if (done) {
	// 				flipLockStore.set(false);
	// 				let cardReadings = cards.map((card) => card.reading).filter((reading) => reading);
	// 				if (cardReadings.length === cards.length && readingScenarios.get(setting)?.conclusion) {
	// 					fetch('/api/conclusion', {
	// 						method: 'POST',
	// 						headers: {
	// 							'Content-Type': 'application/json'
	// 						},
	// 						body: JSON.stringify({
	// 							readings: cardReadings,
	// 							question: question,
	// 							energy: energy
	// 						})
	// 					}).then(async (res) => {
	// 						const reader = res.body?.getReader();

	// 						while (true && reader) {
	// 							const { done, value } = await reader.read();
	// 							const text = new TextDecoder('utf-8').decode(value);
	// 							if (text) $readingStore.conclusion = text;
	// 							if (done) break;
	// 						}
	// 					});
	// 				}
	// 				break;
	// 			}
	// 		}
	// 	});
	// };

	let selectOption = (option: string) => {
		setting = option;
	};
</script>

<div class="container">
	<div class={'input ' + (innerState !== 1 ? 'hidden' : '')}>
		<div class="optionSelect">
			{#each Array.from(readingScenarios).map(([name, setting]) => ({ name, setting })) as scenario}
				<div class="option" on:click={() => selectOption(scenario.name)}>
					<div class={'imgWrapper ' + ($settingStore === scenario.name ? 'active' : '')}>
						<img src="/options/{scenario.name}.png" alt="" />
					</div>
					<div class="optionText">
						<p>{scenario.setting.name}</p>
					</div>
				</div>
			{/each}
		</div>
		<!-- Character Select - regular select element with the characters as options -->
		<div class="characterSelect">
			<select bind:value={character}>
				{#each [...characters] as character}
					<option value={character[0]}>{character[0]}</option>
				{/each}
			</select>
		</div>

		<input bind:value={question} type="text" name="question" id="question" />
		<div bind:this={generateButtonWrapper} class="generateButtonWrapper stacked">
			<div class="generateButton" on:mouseleave={mouseExit} on:touchend={mouseExit}>
				<div class="timeVarIndicator" style={'left:'+(($timeVariableStore-1)/11*100)+'%; ' + 
				'transform: translatey('+(scrollVar===2?'-100%':'-70%')+');' +
				'opacity:'+($timeVariableStore===0 || $timeVariableStore===10 ? '0' : '1')}>
				</div>
				<div class="timeVarIndicator" style={'left:'+(($timeVariableStore-1)/11*100)+'%; ' + 
				'transform: scale(-1) translatey('+(scrollVar===2?'-70%':'-100%')+');' +
				'opacity:'+($timeVariableStore===0 || $timeVariableStore===10 ? '0' : '1')}>
				</div>
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
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(5)}
					on:focus={() => mouseoverSegment(5)}
					on:touchstart={() => mouseoverSegment(5)}
					on:touchmove={() => mouseoverSegment(5)}
					on:click={() => clickSegment(5)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(6)}
					on:focus={() => mouseoverSegment(6)}
					on:touchstart={() => mouseoverSegment(6)}
					on:touchmove={() => mouseoverSegment(6)}
					on:click={() => clickSegment(6)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(7)}
					on:focus={() => mouseoverSegment(7)}
					on:touchstart={() => mouseoverSegment(7)}
					on:touchmove={() => mouseoverSegment(7)}
					on:click={() => clickSegment(7)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(8)}
					on:focus={() => mouseoverSegment(8)}
					on:touchstart={() => mouseoverSegment(8)}
					on:touchmove={() => mouseoverSegment(8)}
					on:click={() => clickSegment(8)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(9)}
					on:focus={() => mouseoverSegment(9)}
					on:touchstart={() => mouseoverSegment(9)}
					on:touchmove={() => mouseoverSegment(9)}
					on:click={() => clickSegment(9)}
				/>
				<button
					type="button"
					on:mouseover={() => mouseoverSegment(10)}
					on:focus={() => mouseoverSegment(10)}
					on:touchstart={() => mouseoverSegment(10)}
					on:touchmove={() => mouseoverSegment(10)}
					on:click={() => clickSegment(10)}
				/>
			</div>
			<p>Tell me my fortune</p>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin-top: 2rem;
		text-align: center;
	}
	.optionSelect {
		align-items: start;
		display: flex;
		gap: 1rem;
		padding: 0 1rem;
		margin-bottom: 2rem;
		overflow-x: scroll;
		max-width: calc(100vw);
		&::-webkit-scrollbar {
			display: none;
		}
		.option {
			display: flex;
			flex-direction: column;
			align-items: center;
			.imgWrapper {
				width: min(30vw, 6rem);
				aspect-ratio: 1/1;
				overflow: hidden;
				border-radius: 100vw;
				border: 1px solid #ffffff;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: border 0.25s ease;
				&.active {
					background: radial-gradient(50% 50% at 50% 50%, rgba(21, 27, 32, 0) 80%, #ffffff 100%);
					& img {
						transform: scale(1.1);
					}
				}
				&:hover {
					& img {
						transform: scale(1.1);
					}
				}
				img {
					transition: all 1s ease;
					object-fit: contain;
					max-height: 80%;
					max-width: 90%;
				}
			}
		}
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
			grid-template-columns: repeat(5, 1fr);
			grid-template-rows: repeat(2, 1fr);
			width: 16rem;
			height: 5rem;
			position: relative;
			overflow-x: hidden;
			overflow-y: hidden;
			& button {
				width: 100%;
				height: 100%;
				background-color: #000;
				border: none;
				&:hover {
					// background-color: rgb(14, 13, 13);
				}
			}
			& .timeVarIndicator{
				background: radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.47) 0%, rgba(217, 217, 217, 0) 100%);
				height: 100%;
				width: 30%;
				transition: all 0.5s ease-out;
				position: absolute;
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
