<script lang="ts">
    import { page } from "$app/stores";

    let profile = $page?.data.profile?.data;
    $: profile = $page?.data.profile?.data;

</script>

<div class="container">
    <div class="tokens">
        <img src="/resources/Token-60.webp" alt="">
        <p>
            {$page?.data.profile?.data.tokens}
        </p>
    </div>
    <div class="essence">
        <img src="/resources/Essence-60.webp" alt="">
        <p>
            {$page?.data.profile?.data.essence}
        </p>
    </div>
</div>

<style lang="scss">
    .container{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        div{
            width: fit-content;
            border: 1px solid rgba(255, 255, 255, 0.25);
            background: $bg2;
            display: flex;
            align-items: center;
            padding: 0.25rem;
            border-radius: 0.5rem;
            img{
                width: 2rem;
                margin-right: 0.5rem;
            }
            
        }
    }
</style>