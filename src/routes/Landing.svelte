<script lang="ts">
	import Collection from "./Collection.svelte";
import Contents from "./Contents.svelte";
import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { invalidateAll } from "$app/navigation";


  let recursiveInvalidate = (count: number) => {
    switch(count){
      case 0: 
        break;
      default:
        setTimeout(() => {
          if(!$page.data.profile){
            invalidateAll();
          }
        }, 500)
        recursiveInvalidate(count - 1)
    }

  }
onMount(() => {
  recursiveInvalidate(5)
})

  let landingReading: ReadingType = {
    cards: [
      {
        name: "The Magician",
        reversed: false,
        energy: {
          upright: [""],
          reversed: [""],
        },
        meaning: "",
        reversedMeaning: "",
      },
      {
        name: "Wheel of Fortune",
        reversed: false,
        energy: {
          upright: [""],
          reversed: [""],
        },
        meaning: "",
        reversedMeaning: "",
      },
      {
        name: "The High Priestess",
        reversed: false,
        energy: {
          upright: [""],
          reversed: [""],
        },
        meaning: "",
        reversedMeaning: "",
      },
      
    ],
    energy: 'Beginnings',
    question: 'What is this website?',
    setting: '',
    conclusion: '',
    character: ''
  };

  let flippedCards = [false, false, false]

  let flipCard = (index: number) => {
    flippedCards[index] = !flippedCards[index];
    console.log(flippedCards)
    if(flippedCards.every((card) => card)) {
      setTimeout(() => {
        onReadingStart()
      }, 500)
    }
  };

  let _getCardImgName = (name: string) => {
		return name.replace(/ /g, '_').replace(/'/g, '');
	};

  let landingText = `Dear friend, you've come seeking answers about what this website can do. Let's see what the cards have to say and explore the hidden truths together.

The first card I've drawn for you is the <b>Magician</b>. This card hints at the transformative potential of this website. By embracing the tarot's guidance, you can gain valuable insights and discover new perspectives that may help you navigate through life's challenges. The Magician's presence indicates that the tools and resources offered by this website can truly empower you on your personal journey.

Next up is the <b>Wheel of Fortune</b>. This card represents the cycles of life and the many opportunities that come with them. The website offers a dynamic and engaging experience, inviting you to dive deeper into the world of tarot. By exploring the various scenarios and unlocking additional card packs, you'll find that the website is constantly evolving, providing you with fresh insights and new ways to grow and learn.

Finally, we have the <b>High Priestess</b>. She is a symbol of intuition and mystery, reminding us that there's more to the website than meets the eye. Through deciphering the secret variables that determine the energy associated with your questions, you can unlock a deeper understanding of the tarot and your own inner wisdom. The High Priestess invites you to trust your instincts and delve into the enigmatic aspects of this website.

Peeking into the cards' wisdom, it's clear that this website offers an engaging and enlightening experience. With the power of AI-driven tarot readings, a wealth of scenarios, and hidden secrets to uncover, you'll find a dynamic and enriching journey ahead. So, my friend, let's embrace the tarot's guidance and unlock its mysteries together.`

  let landingTextArray = landingText.split(' ')

  let landingTextArrayIndex = 0

  let landingTextInterval: any;

  let afterButton: HTMLElement;
  let onReadingStart = () => {
    landingTextInterval = setInterval(() => {
      if (landingTextArrayIndex < landingTextArray.length) {
        landingReading.conclusion += landingTextArray[landingTextArrayIndex] + ' '
        landingTextArrayIndex++
      } else {
        clearInterval(landingTextInterval)
        afterButton.classList.remove('hidden')
      }
    }, 30)
  }

</script>

<div class="container screenPadding">
  <a href="/login"><div class="button">Login</div></a>
  <!-- Landing Reading -->

  <div class="reading">
    <div class="header">
      <h2>"{landingReading.question}"</h2>
      <p>Energy: {landingReading.energy}</p>
    </div>
    <div class="cards">
      {#each new Array(landingReading.cards.length) as card, i}
        <div>
          <div class="stacked">
            {#if landingReading.cards[i]}
              <div class="stacked">
                <div class={'card ' + (flippedCards[i] ? 'cardhidden ' : ' ') + 'ready'}>
                  <img
                    src="/cards/cardback-200.webp"
                    alt=""
                    class={landingReading.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
                    on:click={() => {
                      flipCard(i);
                    }}
                  />
                </div>
  
                <div class={'card ' + (flippedCards[i] ? '' : 'cardhidden')}>
                  <img
                    src="/cards/{_getCardImgName(landingReading.cards[i].name)}-200.webp"
                    alt=""
                    class={'white ' +
                      (landingReading.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow')}
                  />
                  <h3>
                    {(landingReading.cards[i].name)}
                    <span>
                      {landingReading.cards[i].reversed ? ' reversed' : ''}
                    </span>
                  </h3>
                  <!-- <p>{@html landingReading.cards[i].reversed ? landingReading.cards[i].reversedMeaning : landingReading.cards[i].meaning }</p> -->
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    <p class="conclusion">{@html landingReading.conclusion.trim() || ''}</p>
    <a href="/login" bind:this={afterButton} class="hidden"><div class="button">Sign up</div></a>
  </div>
</div>
<div class="collection screenPadding">
  <h2>Collection</h2>
  <Collection />
</div>

<style lang="scss">
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;

    a{
      transition: all 1s ease-in-out;
      position: relative;
      text-decoration: none;
      &.hidden{
        opacity: 0;
        pointer-events: none;
        .button{
          transform: translateY(100%);
        }
      }
      .button{
      margin-top: 2rem;   
      padding: 0.5rem 1.25rem;
      width: max-content;
      border: none;
      border-radius: 0.5rem;
      background: $accent;
      color: black;
      font-family: $header-font;
      font-size: $h4-font-size;
      font-weight: 700;
      cursor: pointer;
      transition: all 1s ease-in-out;
      &:hover{
        background: rgba($accent, 0.75);
      }
      
    }
    }
  }
  .reading {
		margin-top: 2rem;
		padding-bottom: 5rem;
		text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
		& h2 {
			margin-bottom: 0.5rem;
			& ~ p {
				font-size: $mini-font-size;
				margin-bottom: 2rem;
			}
		}
		.cards {
			// display: grid;
			// grid-template-columns: repeat(auto-fit, minmax(250px, 1fr) );
			display: flex;
			flex-wrap: wrap;
			justify-content: space-evenly;
			grid-gap: clamp(32px, 3vw, 64px);

			@media screen and (max-width: 600px) {
				grid-template-columns: repeat(1, 1fr);
			}
			& .card {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				transition: all 1s ease, opacity 0 0.5s ease;
				max-width: min(80vw, 400px);
				justify-self: center;
				perspective: 1200px;
				& p {
					width: 100%;
					text-align: center;
					white-space: break-spaces;
					& li {
						margin: 0.5rem 0rem;
					}
				}
				& img {
					margin: 1rem 0rem;
					width: 100%;
					max-width: min(80vw, 400px);
					border-radius: 0.25rem;
					border: 0.25rem solid #000;
					transition: all 1s ease;
					&.white {
						border: 0.25rem solid #fff;
					}
				}
				&.ready img {
					border: 4px solid #000;
					cursor: pointer;
					filter: drop-shadow(-8px 8px 16px rgba(243, 221, 154, 0.37))
						drop-shadow(8px -8px 16px rgba(46, 103, 132, 0.6));
				}
				&.notready {
					cursor: not-allowed;
					pointer-events: none;
				}
				& h3 {
					font-family: $header-font;
					& span {
						font-size: $base-font-size;
						opacity: 0.8;
						font-weight: 100;
					}
				}
			}
		}
		.conclusion {
			margin: 2rem auto 0rem;
			max-width: 40rem;
			white-space: break-spaces;
		}
	}

	.cardhidden {
		z-index: 0;
		rotate: y 180deg;
		opacity: 0;
		pointer-events: none;
	}

  .collection{
    padding-top: 2rem;
    padding-bottom: 4rem;
    background-color: $bg2;
    text-align: center;
  }
</style>