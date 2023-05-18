<!-- TODO

	- Add a way to save toggle state of decks
	- update card in achievements on load
	
-->
<script lang="ts">
	import { cards, getCardsPack, type CollectionCard, type CollectionDeck } from '$lib/cards';
	import { collectionStore, readingStore } from '../stores';
	import { page } from '$app/stores';
	import { unlocks } from '$lib/unlocks';
	import { secrets } from '$lib/secrets';
	import InfoBox from './InfoBox.svelte';
	import ItemList from './ItemList.svelte';
	import { art, cardbacks } from '$lib/customization';
	import { error } from '$lib/toastStubs';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let landing = false;

	// Transition animations
	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	let decks: CollectionDeck[] = [];

	let checkCollection = () => {
		if (landing) {
			decks = [Array.from(cards.values())[0]];
		} else {
			decks = Array.from(cards.values());
			// For each deck, check if it's available in the collectionStore, if so set the decks value to that
			// If not, set it to true
			decks.forEach((deck) => {
				let inStorage = $collectionStore.find((d) => d.abbrv === deck.abbrv);
				if (inStorage) {
					deck.available = inStorage.available;
				} else {
					deck.available = false;
				}
				if(deck.available){
					deck.cards.forEach((card) => {
						card.reversed = false;
					});
				}
			});
		}
	};
	checkCollection();

	let toggleDeck = (deck: CollectionDeck) => {
		// If there is only 1 available deck, don't allow it to be toggled off
		if (decks.filter((d) => d.available).length === 1 && deck.available) {
			error('There must be at least one deck available!');
			return;
		}
		deck.available = !deck.available;
		collectionStore.set(decks);
		decks = $collectionStore;
		setupItemList();
	};

	let itemList: ListItem[] = [];
	let _getCardImgName = (card: CollectionCard) => {
		return card.name.replace(/ /g, '_').replace(/'/g, '');
	};
	let setupItemList = () => {
		itemList = [];
		decks.forEach((deck, i) => {
			let img =
				cardbacks.find((c) => c.name === deck.name)?.image || _getCardImgName(deck.cards[0]);

			console.log(
				art.find((a) => a.suffix === $readingStore.art)?.decks,
				$readingStore.art,
				deck.name
			);
			itemList.push({
				id: i,
				name: deck.name,
				img:
					'/cards/' +
					img +
					'-120' +
					($readingStore.art &&
					art
						.find((a) => a.suffix === $readingStore.art)
						?.decks.includes(getCardsPack(img.replaceAll('_', ' ')) as string)
						? '-' + $readingStore.art
						: '') +
					'.webp',
				action: () => {
					toggleDeck(deck);
				},
				selected: deck.available,
				available:
					(!unlocks.get(deck.abbrv) ||
						$page.data.profile?.data.experience >= (unlocks.get(deck.abbrv)?.exp || 0)) &&
					(!secrets.has(deck.abbrv) || $page.data.profile?.data.secrets.includes(deck.abbrv)) &&
					(!deck.pack || $page.data.profile?.data.bought_items.includes(deck.pack))
			});
		});
	};
	setupItemList();
	if (decks.filter((d) => d.available).length === 0) {
		toggleDeck(decks[0]);
	}

	// Infobox state

	let currentCard: CollectionCard | undefined = undefined;

	let isShown = false;

	let infoBoxAppear = (card: CollectionCard) => {
		isShown = true;
		currentCard = card;
		setTimeout(() => {
			currentCard = card;
		}, 250);
	};
</script>

<div class="container">
	<div>
		{#if !landing}
			<p class="info">You can click on a deck to enable / disable it for your next reading.</p>
			<ItemList items={itemList} />
		{/if}
		<p class="info">You can click on a card to see more information about it.</p>
		{#each decks.filter((d)=>d.available) as deck (deck.abbrv)}
		<div in:receive="{{key: deck.abbrv}}" out:send="{{key: deck.abbrv}}" animate:flip="{{duration: 600}}" class="deck screenPadding">
					<div class="header">
						<h3>
							{deck.name}
						</h3>
					</div>
					<div class="cards">
						{#each deck.cards as card}
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<div
								tabindex="0"
								on:click={() => {
									infoBoxAppear(card);
								}}
								on:keydown={(e) => {
									if (e.key === 'Enter') {
										infoBoxAppear(card);
									}
								}}
								class="card"
							>
								<img
									src={'/cards/' +
										_getCardImgName(card) +
										'-120' +
										($readingStore.art &&
										art.find((a) => a.suffix === $readingStore.art)?.decks.includes(deck.name)
											? '-' + $readingStore.art
											: '') +
										'.webp'}
									srcset={'/cards/' +
										_getCardImgName(card) +
										'-120' +
										($readingStore.art &&
										art.find((a) => a.suffix === $readingStore.art)?.decks.includes(deck.name)
											? '-' + $readingStore.art
											: '') +
										'.webp 120w, /cards/' +
										_getCardImgName(card) +
										'-200' +
										($readingStore.art &&
										art.find((a) => a.suffix === $readingStore.art)?.decks.includes(deck.name)
											? '-' + $readingStore.art
											: '') +
										'.webp 200w'}
									alt={card?.name}
								/>
							</div>
						{/each}
					</div>
				</div>
		{/each}
	</div>

	<InfoBox bind:isShown currentCard={currentCard} collection={true} />
</div>

<style lang="scss">
	.container {
		text-align: center;
		display: relative;
	}
	h3 {
		font-family: $header-font;
		text-align: center;
		button {
			background: none;
			border: none;
			font-size: $h4-font-size;
		}
	}
	.info {
		margin: 0.5rem 0;
	}
	.deck:not(:first-of-type) {
		margin-top: 1.5rem;
	}
	.cards {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		.card {
			width: max(60px, 8%);
			transition: all 0.1s ease;
			&:hover {
				cursor: pointer;
				transform: translateY(-0.25rem);
			}
			&:focus {
				cursor: pointer;
				transform: translateY(-0.25rem);
			}
			img {
				border-radius: 0.25rem;
				border: 2px solid white;
				width: 100%;
				height: 100%;
				object-fit: cover;
				margin-top: -0.25rem;
				box-shadow: 0 0.5rem 1rem rgba(black, 0.5);
				transition: all 0.1s ease;

				&:focus {
					outline: none;
					transform: translateY(-0.25rem);
				}
			}
		}
		.hiddenImg {
			position: fixed;
			top: 0;
			left: 0;
			width: 0;
			height: 0;
			overflow: hidden;
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
		}
	}

</style>
