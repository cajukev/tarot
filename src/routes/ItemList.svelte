<script lang="ts">
	import { onMount } from "svelte";

	export let items: ListItem[];

  // Add Horizonal drag to the container
  let container:  HTMLElement;
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

onMount(() => { 

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('active');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('active');
  });
  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('active');
  });
  container.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; //scroll-fast
    container.scrollLeft = scrollLeft - walk;
    console.log(walk);
  });
})


</script>

<div class="container" bind:this={container}>
	{#each items as item}
		<div class="item" on:click={item.action}>
			<button class={"item-img " + (item.selected ? "selected" : "")}>
				<img src={item.img} />
			</button>
			<p class="item-name info">{item.name}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	.container {
		max-width: 100vw;
		overflow: auto;
		display: inline-flex;
		gap: 1rem;
		padding: 1rem;
    cursor: grab;
		&::-webkit-scrollbar {
			display: none;
		}
		.item {
			color: white;
			font-size: $mini-font-size;
			font-family: $other-font;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: start;
			width: min-content;
			border: 1px solid transparent;
			
			.item-img {
				outline: none;
				border: none;
				background: rgba($color: #000000, $alpha: 0.3);
				border-radius: 1rem;
				width: 6rem;
				height: 6rem;
				transition: all 0.2s ease;
        cursor: pointer;
				img {
          transition: all 0.2s ease;
					max-width: 80%;
					max-height: 80%;
				}
				&:hover {
          background-color: rgba($color: #000000, $alpha: 0.4);
					img {
            transform: scale(1.05);
					}
				}
				&:focus {
          border: 1px solid white;
          img {
            transform: scale(1.05);
					}
				}
        &.selected{
          background: rgba($color: #000000, $alpha: 0.8);
        }
			}
			.item-name {
				margin-top: 0.5rem;
				text-align: center;
			}
		}
	}
</style>
