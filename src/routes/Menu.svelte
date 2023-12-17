<script>
	import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
const signOutUser = async () => {
  fetch('/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        goto('/');
        // refresh page
        location.reload();
      }
    });
}
</script>

  <div class="container">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/credits">Credits</a>
    <!-- Logout button as link -->
    {#if $page.data?.profile}
    <button class="btn-link" on:click={()=>signOutUser()}>Logout</button>
    {/if}
  </div>

<style lang="scss">
  .container{
    display: flex;
    justify-content: center;
    gap: 1rem;
    a{
      color: white;
    }
    .btn-link{
      font-size: 1rem;
    }
  }
</style>