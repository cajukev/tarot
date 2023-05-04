<script lang="ts">
  import { cardbacks } from "$lib/cardbacks";
  import { page } from "$app/stores";
  import { readingStore } from "../stores";
	import ItemList from "./ItemList.svelte";

  let setCardback = (cardback: string) => {
    $readingStore.cardback = cardback;
    console.log($readingStore.cardback);
  }

  let listItems: ListItem[] = [];
  let selected = 0; 

  let setupItemList = () => {
    listItems = [];
    for (let i = 0; i < cardbacks.length; i++) {
      listItems.push({
        id: i,
        name: cardbacks[i].name,
        img: "/cards/"+cardbacks[i].image+"-200.webp",
        selected: false,
        completed: false,
        action: () => selectItem(i),
        available: !cardbacks[i].pack || $page.data.profile.data.bought_items.includes(cardbacks[i].pack + "") 
      });
    }
  };
  setupItemList();

  let selectItem = (id: number) => {
    listItems[selected].selected = false;
    listItems[id].selected = true;
    selected = id;
    setCardback(cardbacks[id].image);
  }
  selectItem(0);
  

</script>

<div class="container">
  Choose your cardback
  <ItemList items={listItems} />
  
</div>

<style lang="scss">
  .container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>