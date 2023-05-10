<script lang="ts">
	import type { CollectionCard } from '$lib/cards';
	import { cards } from '$lib/cards';
	import { energyGrid, energyList, energyMap } from '$lib/energies';
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
	import { getTokenCost } from '$lib/utils';
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

	$: if($page.data.profile.data){
		// console.log('profile data', $page.data.profile.data);
		$customSpreadsStore = $page.data.profile.data.custom_spreads || [];
		setupItemList();
	}

	$: if($readingStore.ready){
		getReading();
	}

	let listItems: ListItem[] = []


	onMount(() => {
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
			if(!unlocks.get(spread[1].key as string) || $page.data.profile?.data.experience >= (unlocks.get(spread[1].key as string)?.exp || 0)){
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
		if($customSpreadsStore){
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
		if(unlocks.get('custom') && $page.data.profile?.data.experience >= (unlocks.get('custom')?.exp || 0)){
			listItems.push({
				id: listItems.length,
				name: 'Add Custom Spreads',
				img: `./options/Add.png`,
				action: () => {
					navigateToCustomSpreads();
				}
			});
		}else{
			// Add button to navigate to progression
			listItems.push({
				id: listItems.length,
				name: 'Unlock more spreads',
				img: `./options/Lock.svg`,
				action: () => {
					$menuStateStore = {value: 2, change: true}
				}
			});
		}
	}

	$: {
		$readingStore.cards = drawnCards;
		$readingStore.question = question;
	}

	$: if($readingStore.ready){
		$readingStore.ready = false;
		if($readingStore.conclusion === ''){
			getReading();
		}else{
			continueReading();
		}
	}

	let tokenCost = 0;
	$: {
		tokenCost = getTokenCost(
			$readingStore.cards.length,
			$readingStore.model || 'default'
		);
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
		handleSubmit2();
	};

	let handleSubmit2 = () => {
		$achievementsStore = { action: 'AskQuestion', value: 'default' };
		state = 2; // loading
		window.scrollTo(0, 0);
		innerState = 1;
		$readingStore.conclusion = '';
		// console.log('handleSubmit2', pressedSegment - 1, scrollVar, $timeVariableStore);
		$readingStore.energy =
			energyList[energyGrid[pressedSegment - 1][scrollVar][$timeVariableStore]];
		$readingStore.conclusion = '';
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
				customSpread: $customSpreadsStore.find(
					(spread) => spread.name === $readingStore.setting
				),
				// tokenCost: tokenCost
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
						// console.log(error);
						return;
					}
					if (body.cards) {
						let drawnCards = body.cards;
						let returnCards: CollectionCard[] = [];
						drawnCards.forEach((drawnCard) => {
							for (let [key, value] of cards.entries()) {
								value.cards.forEach((card) => {
									// console.log(card.name === drawnCard.name);
									if (drawnCard.name === card.name) {
										card.reversed = drawnCard.reversed;
										returnCards.push(card);
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

	let storedConclusion = "";

	let getReading = () => {
		va.track('GetReading');
		fetch('/api/tarotreading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
				customSpread: $customSpreadsStore.find(
					(spread) => spread.name === $readingStore.setting
				),
				tokenCost: tokenCost
			})
		}).then(async (res) => {
			const reader = res.body?.getReader();
			$achievementsStore = { action: 'StartReading', value: 'default' };
			$readingStore.incomplete = false;
			invalidateAll();
			while (true && reader) {
				const { done, value } = await reader.read();
				const text = new TextDecoder('utf-8').decode(value);
				if (text) {
					// Duplication glitch fix attemmpt
					if(!(storedConclusion.length > 20 && text.length > 1.5 * storedConclusion.length)) {
						$readingStore.conclusion = text;
						storedConclusion = text;
					}
				}
				if (done) {
					// Is wrapped in {}
					if($readingStore.conclusion && $readingStore.conclusion.startsWith('{') && $readingStore.conclusion.endsWith('}')) {
						$readingStore.incomplete = false;
						$readingStore.conclusion = '...';
			
					}else{
						// Does not end with ...
						if($readingStore.conclusion && !$readingStore.conclusion.endsWith('...') ) {
							$readingStore.incomplete = true;
						}else{
							$achievementsStore = { action: 'CompleteReading', value: 'default' };
						}
					}
					break;
				}
			}
		});
	};

	let continueReading = () => {
		va.track('ContinueReading');
		fetch('/api/continueReading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
				customSpread: $customSpreadsStore.find(
					(spread) => spread.name === $readingStore.setting
				)
			})
		}).then(async (res) => {
			const reader = res.body?.getReader();
			$readingStore.incomplete = false;
			invalidateAll();
			while (true && reader) {
				const { done, value } = await reader.read();
				const text = new TextDecoder('utf-8').decode(value);
				if (text){
					// Duplication glitch fix attemmpt
					if(!(storedConclusion.length > 20 && text.length > 1.5 * storedConclusion.length)) {
						$readingStore.conclusion = text;
						storedConclusion = text;
					}
				}
				if (done) {
					// Does not end with ...
					if($readingStore.conclusion && !$readingStore.conclusion.endsWith('...') ) {
						$readingStore.incomplete = true;
					}else{
						$achievementsStore = { action: 'CompleteReading', value: 'default' };
					}
					break;
				}
			}
		});
	};
	

	let selectOption = (option: string) => {
		// console.log(option);
		$readingStore.setting = option;
		$flippedCardsStore = readingSpreads.get(option)?.positions.map(() => false) || $customSpreadsStore.find(
			(spread) => spread.name === option
		)?.positions.map(() => false) || [];
		setupItemList();
	};

	

	let navigateToCustomSpreads = () => {
		$menuStateStore = { value: 4, change: true };
	};

	let deleteCustomSpread = (name: string) => {
		$customSpreadsStore = $customSpreadsStore.filter((spread) => spread.name !== name);
		fetch("/api/updateCustomSpreads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customSpreads: $customSpreadsStore
      }
      ),
    })
		.then(() => {
      invalidateAll();
    });
	};

	$: if ($readingStore) checkForSecret($readingStore.question);

	// Handle Secrets
	let checkForSecret = (input: string) => {
		switch (input.toLowerCase()) {
			// case 'svelte':
			// 	addSecret('Svelte');
			// 	break;
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
				<ItemList bind:items={listItems}></ItemList>
				<!-- <div class="optionSelect spread">
					{#each Array.from(readingSpreads).map( ([name, setting]) => ({ name, setting }) ) as spread}
					{#if !unlocks.get(spread.name) || $page.data.profile?.data.experience >= (unlocks.get(spread.name)?.exp || 0)}
					<button
						class={'option ' + ($readingStore?.setting === spread.name ? 'active' : '')}
						on:click={() => selectOption(spread.name)}
						on:keydown={(event) => {
							if (event.key === 'Enter') selectOption(spread.name);
						}}
					>
						<div class="imgWrapper">
							<img src="/options/{spread.name}.png" alt="" />
						</div>
						<div class="optionText">
							<p>{spread.setting.name}</p>
						</div>
					</button>
					{:else}
					<button
						class="option lockedOption"
						on:click={() => $menuStateStore = { value: 2, change: true }}
						on:keydown={(event) => {
							if (event.key === 'Enter') $menuStateStore = { value: 2, change: true };
						}}
					>
						<div class="imgWrapper">
							<img src="/options/Lock.svg" alt="" />
						</div>
						<div class="optionText">
							<p>{spread.setting.name}</p>
						</div>
					</button>

					{/if}
					{/each}
					{#each $customSpreadsStore as spread}
						<button
							class={'option customOption ' +
								($readingStore?.setting === spread.name ? 'active' : '')}
							on:click={() => selectOption(spread.name)}
							on:keydown={(event) => {
								if (event.key === 'Enter') selectOption(spread.name);
							}}
						>
							<div class="imgWrapper">
								<img src="/options/custom.png" alt="" />
							</div>
							<div class="optionText">
								<p>{spread.name}</p>
							</div>
							<button class="delete" on:click={() => deleteCustomSpread(spread.name)}>
								<p>Delete</p>
							</button>
						</button>
					{/each}
					{#if !unlocks.get('custom') || $page.data.profile?.data.experience >= (unlocks.get('custom')?.exp || 0)}
						<button
							class="option"
							on:click={() => navigateToCustomSpreads()}
							on:keydown={(event) => {
								if (event.key === 'Enter') navigateToCustomSpreads();
							}}
						>
							<div class="imgWrapper">
								<img src="/options/Add.png" alt="" />
							</div>
							<div class="optionText">
								<p>Add Custom Spreads</p>
							</div>
						</button>
					{:else}
						<button
							class="option lockedOption"
							on:click={() => $menuStateStore = { value: 2, change: true }}
							on:keydown={(event) => {
								if (event.key === 'Enter') $menuStateStore = { value: 2, change: true };
							}}
						>
							<div class="imgWrapper">
								<img src="/options/Lock.svg" alt="" />
							</div>
							<div class="optionText">
								<p>Add Custom Spreads</p>
							</div>
						</button>
					{/if}
				</div> -->
			</div>
		</div>
		<!-- {#if tokenCost <= $page.data.profile.data.tokens} -->
		<div>
			<p>Enter your question</p>
			<input bind:value={question} type="text" name="question" id="question" />
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
		<!-- {:else}
		<p>Not enough tokens </p>
		{/if}
		<p class="cost">Costs {tokenCost} token{tokenCost  !== 1 ? "s" : ""} | <span>({$page.data.profile.data.tokens} remaining)</span></p>
		<button class="cta" on:click={() => $menuStateStore = { value: 6, change: true }}>Buy More Tokens</button>
		{#if $page.data.profile.data.tokens < 10}
			<p class="info">Regain up to 10 tokens at 12:00PM EST</p>
		{/if} -->
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
		& .separator {
			background: white;
		}
		& .optionSelectWrapper {
			> p {
				font-size: $h4-font-size;
			}
			& .optionSelect {
				max-width: 100vw;
				overflow: auto;
				display: inline-flex;
				gap: 1rem;
				padding: 1rem;
				&::-webkit-scrollbar {
					display: none;
				}
				.option {
					color: white;
					font-size: $base-font-size;
					font-family: $other-font;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: start;
					padding: 1rem 1rem;
					width: min-content;
					background: rgba($color: #000000, $alpha: 0.2);
					border-radius: 1rem;
					outline: none;
					border: 1px solid transparent;
					cursor: pointer;
					transition: background-color 0.2s ease;
					&::-webkit-scrollbar {
						display: none;
					}
					.imgWrapper {
						width: min(30vw, 6rem);
						aspect-ratio: 1/1;
						overflow: hidden;
						border-radius: 1rem;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							transition: transform 1s ease;
						}
					}
					&:hover {
						background-color: rgba($color: #000000, $alpha: 0.4);
						& img {
							transform: scale(1.05);
						}
					}
					&.active {
						background-color: rgba($color: #000000, $alpha: 0.8);
						border: 1px solid #ffffff2c;
						& img {
							transform: scale(1.1);
						}
					}
					&:focus {
						border: 1px solid white;
					}
					& .optionText {
						margin-top: 0.5rem;
					}
					&.customOption {
						position: relative;
						&:hover {
							& .delete {
								opacity: 1;
								pointer-events: all;
							}
						}
						&:focus {
							& .delete {
								opacity: 1;
								pointer-events: all;
							}
						}
						& .delete {
							position: absolute;
							bottom: 0;
							transform: translateY(50%);
							width: 100%;
							background-color: red;
							border-radius: 0 0 1rem 1rem;
							border: none;
							font-family: $other-font;
							font-size: $base-font-size;
							opacity: 0;
							pointer-events: none;
							transition: opacity 0.25s ease;
							&:hover {
								background-color: #be0000;
								cursor: pointer;
							}
							&:focus {
								opacity: 1;
								pointer-events: all;
								outline: 1px solid white;
							}
						}
					}
				}
				.lockedOption {
					color: white;
					font-size: $base-font-size;
					font-family: $other-font;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: start;
					padding: 1rem 1rem;
					width: min-content;
					background: rgba($color: #000000, $alpha: 0.2);
					border-radius: 1rem;
					outline: none;
					border: 1px solid transparent;
					cursor: pointer;
					transition: all 0.2s ease;
					&::-webkit-scrollbar {
						display: none;
					}
					.imgWrapper {
						width: min(30vw, 6rem);
						aspect-ratio: 1/1;
						overflow: hidden;
						border-radius: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							transition: all 1s ease;
						}
					}
					&:hover {
						background-color: rgba($color: #000000, $alpha: 0.4);
						& img {
							transform: scale(1.05);
						}
					}
					&:focus {
						border: 1px solid white;
					}
					& .optionText {
						margin-top: 0.5rem;
					}
				}
			}
		}
		& .character {
			& .option:not(.lockedOption) {
				& .imgWrapper {
					&.active {
						border: 1px solid #ffffff;
					}
					& img {
						width: 100%;
					}
				}
			}
		}
		& .spread {
			& .option {
				& .imgWrapper {
					& img {
						max-height: 80%;
						max-width: 90%;
					}
				}
			}
		}
		& .lockedOption {
			& .imgWrapper {
				& img {
					width: 60%;
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
			text-align: center;
			font-size: $base-font-size;
			font-family: $other-font;
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
	
</style>
