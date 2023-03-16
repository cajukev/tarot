<script lang="ts">
	import cards, { type CollectionCard } from '$lib/cards';
	let majorArcana: CollectionCard[] = cards.get('Major Arcana');
	console.log(majorArcana);
	let currentCard: CollectionCard = majorArcana[0];

	// Hoverbox follows mouse position
	let hoverBox: HTMLElement;
	let mousePosition = { x: 0, y: 0 };
	let offset = { x: 10, y: 10 };
	let isHovering = false;
</script>

<h2>Major Arcana</h2>
<div
	on:mouseleave={(e) => {
		isHovering = false;
		hoverBox.style.display = 'none';
	}}
	class="pack MA"
>
	{#each majorArcana as card}
		<div
    on:mouseenter={(e) => {
        isHovering = true;
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
        hoverBox.style.top = mousePosition.y +  'px';
        hoverBox.style.left = mousePosition.x +  'px';
        hoverBox.style.transform = 'translate(-50%, 0)';
        hoverBox.style.display = 'block';
        currentCard = card;} 
    }
			on:mousemove={(e) => {
				isHovering = true;
				mousePosition.x = e.clientX;
				mousePosition.y = e.clientY;
				hoverBox.style.top = mousePosition.y +  'px';
				hoverBox.style.left = mousePosition.x +  'px';
        hoverBox.style.transform = 'translate(-50%, 0)';
				hoverBox.style.display = 'block';
				currentCard = card;
			}}
      on:mouseleave={(e) => {
        isHovering = false;
        hoverBox.style.display = 'none';
      }}
      on:pointerleave={(e) => {
        isHovering = false;
        hoverBox.style.display = 'none';
      }}
			class="card"
		>
			<img src="/cards/{card.name}-400.webp" alt="" />
		</div>
	{/each}
</div>

<div bind:this={hoverBox} class="hoverBox">
	<div class="hoverBoxContent">
		<h3>{currentCard.name}</h3>
		<p><br><b>Meaning:</b> {currentCard.meaning}</p>
		<p><br><b>Reversed Meaning:</b> {currentCard.reversedMeaning}</p>
	</div>
</div>

<style lang="scss">
	h2 {
		font-family: $header-font;
		@media screen and (max-width: 1241px) {
			text-align: center;
		}
	}
	.pack {
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0rem;
		.card {
			width: max(100px, 9.0909%);
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}

  .hoverBox{
    position: fixed;
    width: 20rem;
    z-index: 100;
    pointer-events: none;
    background-color: black;
    border: 1px solid black;
    border-radius: 5px;
    padding: 0.5rem;
    .hoverBoxContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h3{
        margin: 0;
      }
      p{
        margin: 0;
      }
    }
  }
</style>
