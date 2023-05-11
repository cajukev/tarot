<script lang="ts">
  import { cardbacks, art } from "$lib/customization";
  import { page } from "$app/stores";
  import { readingStore, textSizeStore } from "../stores";
	import ItemList from "./ItemList.svelte";

  let setCardback = (cardback: string) => {
    $readingStore.cardback = cardback;
    // console.log($readingStore.cardback);
  }

  let setArt = (art: string) => {
    $readingStore.art = art;
    // console.log($readingStore.art);
  }
  

  let listItemsCB: ListItem[] = [];
  let selected = 0; 

  let setupItemListCB = () => {
    listItemsCB = [];
    for (let i = 0; i < cardbacks.length; i++) {
      listItemsCB.push({
        id: i,
        name: cardbacks[i].name,
        img: "/cards/"+cardbacks[i].image+"-120.webp",
        selected: false,
        completed: false,
        action: () => selectItemCB(i),
        available: !cardbacks[i].pack || $page.data.profile.data.bought_items.includes(cardbacks[i].pack + "") 
      });
    }
  };
  setupItemListCB();

  let selectItemCB = (id: number) => {
    listItemsCB[selected].selected = false;
    listItemsCB[id].selected = true;
    selected = id;
    setCardback(cardbacks[id].image);
  }
  selectItemCB($readingStore.cardback ? cardbacks.findIndex(c => c.image === $readingStore.cardback) : 0);
  
  let listItemsArt: ListItem[] = [];
  let selectedArt = 0;

  let setupItemListArt = () => {
    listItemsArt = [];
    for (let i = 0; i < art.length; i++) {
      listItemsArt.push({
        id: i,
        name: art[i].name,
        img: "/cards/"+art[i].card+"-200"+(art[i].suffix ? "-"+art[i].suffix : "")+".webp",
        selected: false,
        completed: false,
        action: () => selectItemArt(i)
      });
    }
  };
  setupItemListArt();

  let selectItemArt = (id: number) => {
    listItemsArt[selectedArt].selected = false;
    listItemsArt[id].selected = true;
    selectedArt = id;
    setArt(art[id].suffix);
  }
  selectItemArt($readingStore.art ? art.findIndex(a => a.suffix === $readingStore.art) : 0);

  let textSize = $textSizeStore;
  $: textSizeTrigger(textSize);

  let textSizeTrigger = (textSize: number) => {
    document.documentElement.style.setProperty('--fontMultiplier', textSize+"");
    $textSizeStore = textSize;
  }

</script>

<div class="container">
  Choose your cardback
  <ItemList items={listItemsCB} />

  Choose your art
  <ItemList items={listItemsArt} />

  <p class="conclusion">
    Change text size
  </p> 
  <select bind:value={textSize}>
    <option value={1}>1x</option>
    <option value={1.25}>1.25x</option>
    <option value={1.5}>1.5x</option>
  </select>
  
</div>

<style lang="scss">
  .container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>