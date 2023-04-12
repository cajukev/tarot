<script>
  	import { page } from "$app/stores"; 

</script>

  <div class="container">
    <!-- Login nav -->
  {#if $page.data.session}
  <nav>
    <span>Welcome <b>{$page.data.session.user.email?.split('@')[0]}</b></span>
    <span>Experience: <b>{$page.data.profile?.data.experience}</b></span>
    <form method="POST" action="/login?/logout">
      <input type="submit" value="Logout" />
    </form>
  </nav>
  {:else}
  <nav>
    <a href="/login">Login</a>
    <!-- <a href="/signup">Sign up</a> -->
  </nav>
  {/if}
  </div>

<style lang="scss">
  
	form{
		margin-left: 1rem;
		display: inline;
		& input{
			font-family: $other-font;
			font-size: $base-font-size;
			border: none;
			background: none;
			font-weight: 300;
			cursor: pointer;
      color: white;
		}
	}
</style>