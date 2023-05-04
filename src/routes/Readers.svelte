<script lang="ts">
  import characters from "$lib/characters";
  import { unlocks } from "$lib/unlocks";
  import { page } from "$app/stores";
	import { get } from "svelte/store";
	import ItemList from "./ItemList.svelte";
  let charactersArray = Array.from(characters.entries());

  let listItems: ListItem[] = [];
  
  let setupItemList = () => {
    listItems = [];
    for (let i = 0; i < charactersArray.length; i++) {
      listItems.push({
        id: i,
        name: charactersArray[i][1].name,
        img: "/options/" + charactersArray[i][1].name + "-200.webp",
        selected: false,
        action() {
          selectItem(i);
        }
      });
    }
  };
  setupItemList();

  let selected = -1;

  let selectItem = (id: number) => {
    if (selected === id) {
      return;
    } else{
      selected = id;
      for (let i = 0; i < listItems.length; i++) {
        if (i === id) {
          listItems[i].selected = true;
        } else {
          listItems[i].selected = false;
        }
      }
    }
  };
  selectItem(0);

</script>

<div class="container">
  <p class="info">
    Click on a character to learn more about them.
  </p>
  <ItemList items={listItems} />
  {#each Array.from(characters).map( ([name, character]) => ({ name, character }) ) as character}
   {#if listItems[selected]?.name === character.character.name}
    <div class="character">
      <div class="imgWrapper stacked">
        <img src={"/options/"+character.name+"-1024.webp"} alt={character.character.name} />
        <div class="shadow top-bottom" />
        <div class="shadow left-right" />
      </div>
      <div class="info">
        <p class="name">{character.character.name} - <span class="title">{character.character.title}</span></p>
        <p class="model">AI Model: {character.character.model}</p>
        {#if character.character.pack && character.character.pack !== 'unlock' && !$page.data.profile?.data.bought_items.includes(character.character.pack)}
          <p class="unlock">{character.character.name} {character.character.title} is available for purchase in the shop.</p>
        {/if}
        {#if unlocks.get(character.character.name) && $page.data.profile?.data.experience < (unlocks.get(character.character.name)?.exp || 0)}  
        <div class="unlock">
          <p>{character.character.name} {character.character.title} is unlocked at {unlocks.get(character.character.name)?.exp} experience.</p>
        </div>
        {/if}
        <p class="description">{@html character.character.publicDescription}</p>
        <p class="imgBy">Image created by {character.character.imageCreator}</p>
      </div>
    </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    .character{
      // Responsive display
      // Mobile
      text-align: center;
      // Desktop
      @media screen and (min-width: $breakpoint-2) {
        text-align: start;
        display: grid;
        grid-template-columns: 50% 50%;
        .imgWrapper{
          transform: translateX(-2rem);
          grid-column: 1;
          grid-row: 1;
        }
      }
      // Content
      .imgWrapper{
        position: relative;
        width: fit-content;
        img{
          width: 100%;
          height: auto;
        }
        .top-bottom{
          &::before{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 10%;
            background: linear-gradient(180deg, $bg 0%, rgba($bg, 0) 100%);
          }
          &::after{
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 10%;
            background: linear-gradient(0deg, rgba($bg, 1) 0%, rgba($bg, 0) 100%);
          }
        }
        .left-right{
          &::before{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 10%;
            height: 100%;
            background: linear-gradient(90deg, rgba($bg, 1) 0%, rgba($bg, 0) 100%);
          }
          &::after{
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 10%;
            height: 100%;
            background: linear-gradient(270deg, rgba($bg, 1) 0%, rgba($bg, 0) 100%);
          }
        }
      }
      .info{
        display: flex;
        flex-direction: column;
        max-width: 30rem;
        .name{
          font-family: $header-font;
          font-size: $h3-font-size;
          margin-bottom: 0.5rem;
          .title{
          font-size: $h4-font-size;
          }
        }
        .model{
          margin-bottom: 1rem;
        }
        .unlock{
          margin-bottom: 1rem;
          font-weight: 700;
          color: rgb(255, 114, 114);
        }
        .description{
          margin-bottom: 2rem;
        }
        .imgBy{
          font-size: $mini-font-size;
        }
      }
    }
  }
</style>