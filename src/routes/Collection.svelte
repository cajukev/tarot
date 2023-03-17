<script lang="ts">
	import cards, { type CollectionCard } from '$lib/cards';
	let majorArcana: CollectionCard[] = cards.get('Major Arcana');
	console.log(majorArcana);
	let currentCard: CollectionCard = majorArcana[0];

	// Hoverbox follows mouse position
	let hoverBox: HTMLDivElement;
	let mousePosition = { x: 0, y: 0 };
	let offset = { x: 10, y: 10 };
	let isHovering = false;

	let hoverBoxAppear = (e: MouseEvent, card: CollectionCard) => {
		isHovering = true;
		mousePosition.x = e.clientX;
		mousePosition.y = e.clientY;
		hoverBox.style.top = mousePosition.y - hoverBox.offsetHeight / 2 + 'px';
		console.log(
			0,
			mousePosition.x - hoverBox.offsetWidth / 2,
			window.innerWidth - hoverBox.offsetWidth
		);
		hoverBox.style.left =
			Math.min(
				Math.max(mousePosition.x - hoverBox.offsetWidth / 2, 0),
				window.innerWidth - hoverBox.offsetWidth
			) + 'px';
		hoverBox.classList.add('visible');
		currentCard = card;
	};
</script>

<div class="container">

	<h2>Major Arcana</h2>
	<div
		on:mouseleave={(e) => {
			isHovering = false;
			hoverBox.classList.remove('visible');
		}}
		class="pack MA"
	>
		{#each majorArcana as card}
			<div
				on:mousemove={(e) => {
					hoverBoxAppear(e, card);
				}}
				on:mouseleave={(e) => {
					isHovering = false;
					hoverBox.classList.remove('visible');
				}}
				class="card"
			>
				<img src="/cards/{card.name}-400.webp" alt="" />
			</div>
		{/each}
	</div>
	
	<div bind:this={hoverBox} class="hoverBox">
		<div class="hoverBoxContent">
			<img src="/cards/{currentCard.name}-400.webp" alt="" />
			<h3>{currentCard.name}</h3>
			<p>
				<br /><b>Meaning:</b>
				<br />{currentCard.meaning}
			</p>
			<p>
				<br /><b>Reversed Meaning:</b>
				<br />{currentCard.reversedMeaning}
			</p>
		</div>
	</div>
</div>

<style lang="scss">
	.container{
		padding-bottom: 300px;
	}
	h2 {
		margin-top: 2rem;
		font-family: $header-font;
		@media screen and (max-width: 997px) {
			text-align: center;
		}
	}
	h3 {
		font-family: $header-font;
	}
	.pack {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0rem;
		.card {
			width: max(80px, 9.0909%);
			padding-right: 0.25rem;
			img {
				border-radius: 0.25rem;
				border: 2px solid white;
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}

	.hoverBox {
		position: fixed;
		width: 20rem;
		z-index: 100;
		pointer-events: none;
		background-color: rgba($bg, 0.5);
		backdrop-filter: blur(5px);
		border-radius: 5px;
		padding: 0.5rem;
		padding-top: 2rem;
		transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
		text-align: center;
		.hoverBoxContent {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			h3 {
				margin-top: 0.5rem;
			}
			& img {
				width: 300px;
				border-radius: 0.25rem;
				border: 2px solid white;
			}
			p {
				margin: 0;
			}
		}
		&:not(.visible) {
			opacity: 0;
			transform: scale(0.9) translateY(1rem);
			pointer-events: none;
		}
	}
</style>
