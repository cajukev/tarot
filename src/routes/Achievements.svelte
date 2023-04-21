<script lang="ts">
  import { achievements, achievementsOrder } from "$lib/achievements";
  import { page } from "$app/stores";
  import { objToMap } from "$lib/utils";
  let achievementsArray = Array.from((objToMap($page.data.profile.data.achievements) || achievements).entries());
  console.log("achievementsArray", achievementsArray);
  // AchievementsOrder is an array of achievement IDs in the order they should be displayed
  achievementsArray.sort((a, b) => achievementsOrder.indexOf(a[0]) - achievementsOrder.indexOf(b[0]));
</script>

<div class="container">
  <div class="achievements">
    {#each achievementsArray as [id, achievement] }
    <div class={"achievement " + (achievement.completed ? "completed" : "")}>
      <p>
        {achievement.name}
      </p>
      {#if achievement.completed }
        <img src="check.svg" alt="">
        {:else}
        <p class="exp">+{achievement.experience} exp</p>
      {/if}
      <p>
        {achievement.description}
      </p>
    </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .achievements{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    .achievement{
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 10rem;
      background: $bg;
      border-radius: 0.5rem;
      padding: 1rem 0.25rem;
      transition: all 0.25s ease;
      &.completed{
        opacity: 0.65;
        &:hover{
          opacity: 1;
        }
      }
      img{
        width: 50px;
      }
      p{
        margin: 0;
      }
      p.exp, img{
        margin: 1rem 0;
      }
      .exp{
        font-weight: 700;
        font-size: $h4-font-size;
      }
    }
  }
</style>