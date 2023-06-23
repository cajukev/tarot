<script lang="ts">
	import type { CollectionCard } from '$lib/cards';
	import { cards } from '$lib/cards';
	import { energyGrid, energyList } from '$lib/energies';
	import readingSpreads from '$lib/readingSpreads';
	import { onMount } from 'svelte';
	import characters from '$lib/characters';
	import {
		readingStore,
		timeVariableStore,
		flippedCardsStore,
		collectionStore,
		menuStateStore,
		customSpreadsStore,
		achievementsStore
	} from '../stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { secret as secretToast } from '$lib/toastStubs';
	import { secrets } from '$lib/secrets';
	import { unlocks } from '$lib/unlocks';
	import { blobToBase64, getTokenCost } from '$lib/utils';
	import va from '@vercel/analytics';
	import ItemList from './ItemList.svelte';
	export let state: number;
	export let error = '';
	let innerState = 1;

	let generateButtonWrapper: HTMLDivElement;
	let pressedSegment = 0;

	$readingStore.setting = 'qa';
	$readingStore.character = 'Alex';

	let drawnCards: CollectionCard[] = [];
	let question = '';

	let scrollVar = 1;
	let oldScroll = 0;

	let maxLength = 100;

	let listItems: ListItem[] = [];

	$: if ($page.data.profile.data) {
		// console.log('profile data', $page.data.profile.data);
		$customSpreadsStore = $page.data.profile.data.custom_spreads || [];
		setupItemList();
	}

	$: if ($readingStore.ready) {
		getReading();
	}

	onMount(async () => {
		// Scroll Listener
		window.onscroll = function () {
			scrollVar = oldScroll > scrollY ? 0 : 1;
			oldScroll = scrollY;
		};
		// Setup list items
		setupItemList();
	});

	let setupItemList = () => {
		// console.log('setupItemList', $readingStore.setting);
		listItems = [];
		Array.from(readingSpreads).forEach((spread) => {
			if (
				!unlocks.get(spread[1].key as string) ||
				$page.data.profile?.data.experience >= (unlocks.get(spread[1].key as string)?.exp || 0)
			) {
				listItems.push({
					id: listItems.length,
					name: spread[1].name,
					img: `./options/${spread[0]}.png`,
					action: () => {
						selectOption(spread[0]);
					},
					selected: spread[0] === $readingStore.setting
				});
			}
		});

		// Add exisiting custom spreads
		if ($customSpreadsStore) {
			$customSpreadsStore.forEach((spread) => {
				listItems.push({
					id: listItems.length,
					name: spread.name,
					img: `./options/custom.png`,
					action: () => {
						selectOption(spread.name);
					},
					selected: spread.name === $readingStore.setting
				});
			});
		}

		// Add custom spreads if unlocked
		if (
			unlocks.get('custom') &&
			$page.data.profile?.data.experience >= (unlocks.get('custom')?.exp || 0)
		) {
			listItems.push({
				id: listItems.length,
				name: 'Add Custom Spreads',
				img: `./options/Add.png`,
				action: () => {
					navigateToCustomSpreads();
				}
			});
		} else {
			// Add button to navigate to progression
			listItems.push({
				id: listItems.length,
				name: 'Unlock more spreads',
				img: `./options/Lock.svg`,
				action: () => {
					$menuStateStore = { value: 2, change: true };
				}
			});
		}
	};

	// Recording
	let media: any = [];
	let mediaRecorder: any = null;
	let recordingState = 0;
	let startRecording = async () => {
		recordingState = 1;
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.ondataavailable = (e: any) => media.push(e.data);
		mediaRecorder.onstop = async function () {
			const blob = new Blob(media, { type: 'audio/wav' });
			const base64blob = await blobToBase64(blob);
			// console.log('blob', blob, base64blob);
			fetch('/api/speechToText', {
				method: 'POST',
				body: JSON.stringify({ audio: base64blob })
			})
				.then((response) => response.json())
				.then((data) => {
					// console.log('data', data);
					recordingState = 3;
					question = data.body.transcript.text;
					invalidateAll();
				});
			media = [];
		};
		mediaRecorder.start();

		setTimeout(() => {
			stopRecording();
		}, 5000);
	};

	let stopRecording = () => {
		if(recordingState === 2) return;
		recordingState = 2;
		mediaRecorder.stop();
		mediaRecorder = null;
	};

	$: {
		$readingStore.cards = drawnCards;
		$readingStore.question = question;
	}

	$: if ($readingStore.ready) {
		$readingStore.ready = false;
		getReading();
	}

	let tokenCost = 0;
	$: {
		tokenCost = getTokenCost($readingStore.cards.length, $readingStore.model || 'default', $page.data.profile?.data?.information);
	}

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
		draw();
	};

	let draw = () => {
		$achievementsStore = { action: 'AskQuestion', value: 'default' };
		state = 2; // loading
		window.scrollTo(0, 0);
		innerState = 1;
		$readingStore.conclusion = '';
		$readingStore.analysis = '';
		$readingStore.energy =
			energyList[energyGrid[pressedSegment - 1][scrollVar][$timeVariableStore]];
		$readingStore.cards = [];
		// Check if custom spread
		const customSpread = $customSpreadsStore.find(
			(spread) => spread.name === $readingStore.setting
		);
		if (customSpread) {
			$flippedCardsStore = customSpread.positions.map((pos) => false);
		} else {
			$flippedCardsStore =
				readingSpreads.get($readingStore.setting)?.positions.map((pos) => false) || [];
		}
		va.track('Draw');
		fetch('/api/draw', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
				collectionDecks: $collectionStore,
				customSpread: $customSpreadsStore.find((spread) => spread.name === $readingStore.setting)
				// tokenCost: tokenCost
			})
		})
			.then((res) => res.json())
			.then((data) => data.body)
			.then(
				(body: {
					cards?: { name: string; reversed: boolean; position: string }[];
					question?: string;
					error?: string;
				}) => {
					if (body.error) {
						state = 4;
						error = body.error;
						// console.log(error);
						return;
					}
					if (body.cards) {
						let drawnCards = body.cards;
						$readingStore.question = body.question || $readingStore.question;
						let returnCards: CollectionCard[] = [];
						drawnCards.forEach((drawnCard) => {
							for (let [key, value] of cards.entries()) {
								value.cards.forEach((card) => {
									// console.log(card.name === drawnCard.name);
									if (drawnCard.name === card.name) {
										card.reversed = drawnCard.reversed;
										returnCards.push(JSON.parse(JSON.stringify(card)));
									}
								});
							}
						});
						// console.log(returnCards);
						$readingStore.cards = returnCards;
						invalidateAll();
						state = 3;
					}
				}
			);
	};

	let setEmptyCards = () => {
		$achievementsStore = { action: 'AskQuestion', value: 'default' };
		state = 2; // loading
		window.scrollTo(0, 0);
		innerState = 1;
		$readingStore.conclusion = '';
		$readingStore.analysis = '';
		$readingStore.energy = '';
		// Validate question
		fetch('/api/validateQuestion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: $readingStore.question
			})
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.body.error) {
					state = 4;
					error = data.body.error;
					return;
				} else {
					// Get number of cards in spread
					let numCards = 0;
					const customSpread = $customSpreadsStore.find(
						(spread) => spread.name === $readingStore.setting
					);
					if (customSpread) {
						numCards = customSpread.positions.length;
						$flippedCardsStore = customSpread.positions.map((pos) => false);
					} else {
						numCards = readingSpreads.get($readingStore.setting)?.positions.length || 0;
						$flippedCardsStore =
							readingSpreads.get($readingStore.setting)?.positions.map((pos) => false) || [];
					}
					// Create empty cards of that length
					let emptyCards: CollectionCard[] = [];
					for (let i = 0; i < numCards; i++) {
						emptyCards.push({
							name: 'undefined',
							energy: { upright: ['none'], reversed: ['none'] },
							meaning: 'none',
							reversedMeaning: 'none'
						});
					}

					$readingStore.cards = emptyCards;
					$readingStore.energy = '';

					state = 3;
				}
			});
	};

	let storedConclusion = '';

	let getReading = () => {
		$readingStore.conclusion = '';
		storedConclusion = '';
		va.track('GetReading');
		fetch('/api/tarotreading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
				customSpread: $customSpreadsStore.find((spread) => spread.name === $readingStore.setting),
				tokenCost: tokenCost
			})
		}).then(async (res) => {
			const reader = res.body?.getReader();
			$achievementsStore = { action: 'StartReading', value: 'default' };
			$readingStore.incomplete = false;
			invalidateAll();
			while (true && reader) {
				const { done, value } = await reader.read();
				const res = new TextDecoder('utf-8').decode(value);
				console.log(res.substring(res.indexOf('{'), res.lastIndexOf('}') + 1));
				let text = chunksToText(res);
				// let text = res.slice(res.indexOf('"choices":[{"delta":{"content":"') + 32 , res.indexOf('"}',res.indexOf('"choices":[{"delta":{"content":"') + 32))
				if (text && !text.includes('"finish_reason":"stop')) {
					// Duplication glitch fix attempt
					if (!(storedConclusion.length > 20 && text.length > 1.5 * storedConclusion.length)) {
						$readingStore.conclusion += text.replaceAll('\\n', '<br>').replaceAll('\\', '');
						storedConclusion = $readingStore.conclusion;
					}
				}
				if (done) {
					// Is wrapped in {}
					if (
						$readingStore.conclusion &&
						$readingStore.conclusion.startsWith('{') &&
						$readingStore.conclusion.endsWith('}')
					) {
						$readingStore.incomplete = false;
						$readingStore.conclusion = '...';
					} else {
						$readingStore.conclusion += `
						
...`;
						$achievementsStore = { action: 'CompleteReading', value: 'default' };
					}
					break;
				}
			}
		});
	};

	let chunksToText = (text: string): string => {
		if (text.includes('"choices":[{"delta":{"content":"')) {
			let startIndex = text.indexOf('"choices":[{"delta":{"content":"') + 32;
			let endIndex = text.indexOf('"}', text.indexOf('"choices":[{"delta":{"content":"') + 32);
			return text.slice(startIndex, endIndex) + chunksToText(text.slice(endIndex + 2));
		} else {
			return '';
		}
	};

	let selectOption = (option: string) => {
		// console.log(option);
		$readingStore.setting = option;
		$flippedCardsStore =
			readingSpreads.get(option)?.positions.map(() => false) ||
			$customSpreadsStore.find((spread) => spread.name === option)?.positions.map(() => false) ||
			[];
		setupItemList();
	};

	let navigateToCustomSpreads = () => {
		$menuStateStore = { value: 4, change: true };
	};

	$: if ($readingStore) checkForSecret($readingStore.question);

	// Handle Secrets
	let checkForSecret = (input: string) => {
		switch (
			input.toLowerCase()
			// case 'svelte':
			// 	addSecret('Svelte');
			// 	break;
		) {
		}
	};

	let addSecret = (secret: string) => {
		if ($page.data.profile.data.secrets.includes(secret)) return;
		fetch('/api/addSecret', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				secrets: $page.data.profile.data.secrets.concat(secret)
			})
		}).then(() => {
			secretToast(
				`<b>Secret Unlocked: ${secrets.get(secret)?.name}</b><br>
			${secrets.get(secret)?.description}`,
				{
					onpop: () => {
						switch (secrets.get(secret)?.type) {
							case 'card':
								$menuStateStore = { value: 0, change: true };
								break;
						}
					}
				}
			);
			invalidateAll();
		});
	};
</script>

<div class="container">
	<div class={'input ' + (innerState !== 1 ? 'hidden' : '')}>
		<div class="setup">
			<div class="optionSelectWrapper">
				<p>Choose a spread</p>
				<ItemList bind:items={listItems} />
			</div>
		</div>
		<div class="inputSection">
			<p>What is your question?</p>

			{#if recordingState === 0 || recordingState === 2 || recordingState === 3 }
			<button class="micButton" on:click={() => startRecording()}>
				<svg viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M14 22.85C12.5667 22.85 11.3667 22.3347 10.4 21.3042C9.43333 20.2736 8.95 19.0222 8.95 17.55V5C8.95 3.6111 9.44068 2.43055 10.4221 1.45835C11.4034 0.486116 12.5951 0 13.9971 0C15.399 0 16.5917 0.486116 17.575 1.45835C18.5583 2.43055 19.05 3.6111 19.05 5V17.55C19.05 19.0222 18.5667 20.2736 17.6 21.3042C16.6333 22.3347 15.4333 22.85 14 22.85ZM12.5 38V31.2C8.96667 30.8333 6 29.35 3.6 26.75C1.2 24.15 0 21.0833 0 17.55H3C3 20.5833 4.07147 23.1333 6.2144 25.2C8.35733 27.2667 10.949 28.3 13.9894 28.3C17.0298 28.3 19.625 27.2667 21.775 25.2C23.925 23.1333 25 20.5833 25 17.55H28C28 21.0833 26.8 24.15 24.4 26.75C22 29.35 19.0333 30.8333 15.5 31.2V38H12.5ZM14 19.85C14.6 19.85 15.0917 19.625 15.475 19.175C15.8583 18.725 16.05 18.1833 16.05 17.55V5C16.05 4.43333 15.8535 3.95833 15.4606 3.575C15.0677 3.19167 14.5808 3 14 3C13.4192 3 12.9323 3.19167 12.5394 3.575C12.1465 3.95833 11.95 4.43333 11.95 5V17.55C11.95 18.1833 12.1417 18.725 12.525 19.175C12.9083 19.625 13.4 19.85 14 19.85Z" fill="white"/>
				</svg>
			</button>
			<p class="info">
				Mic costs 0.01 tokens
			</p>
			{/if}
			<!-- 5 second timer -->
			{#if recordingState === 1 }
			<div class="stacked">
				<div class="timer">
					<span></span>
				</div>
				recording
			</div>
			{/if}
			<!-- Waiting response -->
			{#if recordingState === 2 }
			<p>Understanding question...</p>
			{/if}
			<textarea
				bind:value={question}
				name="question"
				id="question"
				maxlength={maxLength}
				placeholder={readingSpreads?.get($readingStore.setting)?.placeholders?.[
					Math.floor(
						Math.random() * (readingSpreads?.get($readingStore.setting)?.placeholders?.length ?? 0)
					)
				] || ''}
			/>
			<p class="textLengthCounter">{question.length}/{maxLength}</p>
			<div bind:this={generateButtonWrapper} class="generateButtonWrapper stacked">
				<div class="generateButton" on:mouseleave={mouseExit} on:touchend={mouseExit}>
					<div
						class="timeVarIndicator"
						style={'left:' +
							(($timeVariableStore - 1) / 11) * 100 +
							'%; ' +
							'transform: translatey(' +
							(scrollVar === 1 ? '-100%' : '-70%') +
							');' +
							'opacity:' +
							($timeVariableStore === 0 || $timeVariableStore === 10 ? '0' : '1')}
					/>
					<div
						class="timeVarIndicator"
						style={'left:' +
							(($timeVariableStore - 1) / 11) * 100 +
							'%; ' +
							'transform: scale(-1) translatey(' +
							(scrollVar === 1 ? '-70%' : '-100%') +
							');' +
							'opacity:' +
							($timeVariableStore === 0 || $timeVariableStore === 10 ? '0' : '1')}
					/>
					{#each Array.apply(null, Array(10)).map(function () {}) as _, i}
						<button
							type="button"
							on:mouseover|preventDefault={() => mouseoverSegment(i + 1)}
							on:focus={() => mouseoverSegment(i + 1)}
							on:touchstart={() => mouseoverSegment(i + 1)}
							on:touchmove={() => mouseoverSegment(i + 1)}
							on:click|preventDefault={() => clickSegment(i + 1)}
						/>
					{/each}
				</div>
				<p>Draw cards</p>
			</div>
			<button class="manual" on:click={() => setEmptyCards()}>My cards are already drawn</button>
			<!-- If daily is available -->
			{#if !$page.data.profile.data.daily}
				<p class="bonus info">
					Daily bonus is available! <br /> Complete a reading to earn 5 shop essence!
				</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin-top: 2rem;
		text-align: center;
	}
	.setup {
		display: grid;
		grid-template-columns: 100%;
		& .optionSelectWrapper {
			> p {
				font-size: $h4-font-size;
			}
		}
	}
	.inputSection{
		display: flex;
		flex-direction: column;
		.micButton{
			border: none;
			background: none;
			margin: 0.5rem;
			svg{
				width: 1.5rem
			}
		}
		.timer{
			display: flex;
			justify-content: center;
			align-items: center;
			span{
				display: block;
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				background-color: red;
				animation: shrink 5s linear forwards;
				@keyframes shrink {
					0% {
						transform: scale(1);
					}
					100% {
						transform: scale(0);
					}
				}
			}
	}
	}
	.input {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		& textarea {
			resize: vertical;
			width: 30rem;
			max-width: 80vw;
			height: 2.5rem;
			padding-top: 0.25rem;
			margin-top: 0.5rem;
			text-align: center;
			font-size: $base-font-size;
			font-family: $other-font;
		}
		.textLengthCounter {
			font-size: $mini-font-size;
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
			min-height: 5rem;
			position: relative;
			overflow-x: hidden;
			overflow-y: hidden;
			& button {
				width: 100%;
				height: 100%;
				background-color: #000;
				border: none;
			}
			& .timeVarIndicator {
				pointer-events: none;
				background: radial-gradient(
					50% 100% at 50% 0%,
					rgba(255, 255, 255, 0.47) 0%,
					rgba(217, 217, 217, 0) 100%
				);
				height: 100%;
				width: 30%;
				transition: all 0.5s cubic-bezier(0.33, 1, 0.68, 1);
				position: absolute;
			}
		}
		& p {
			pointer-events: none;
			place-self: center;
			font-size: $h4-font-size;
			transform: translateZ(0);
		}
	}
	.manual {
		margin-top: 1rem;
		background-color: #f7db5d;
		border: none;
		padding: 0.25rem 0.5rem;
		font-family: serif;
		font-size: clamp(20px, 2.3vw, 26px);
		cursor: pointer;
	}
	.bonus {
		margin-top: 0.5rem;
	}
	


</style>
