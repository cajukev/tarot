<script lang="ts">
  import { cardbacks } from "$lib/cardbacks";
  import { page } from "$app/stores";
  import { readingStore } from "../stores";

  let setCardback = (cardback: string) => {
    $readingStore.cardback = cardback;
    console.log($readingStore.cardback);
  }
</script>

<div class="container">
  Choose your cardback
  {#each cardbacks as cardback}
  <div class="cardback">
    <img src={"/cards/"+cardback.image+"-200.webp"} />
    <div class="cardback-name">{cardback.name}</div>
    <div class="cardback-choose">
      <button
        class="btn btn-primary"
        on:click={() => setCardback(cardback.image)}
      >
        Choose
      </button>
    </div>
  </div>
  {/each}
</div>

<style lang="scss">
</style>