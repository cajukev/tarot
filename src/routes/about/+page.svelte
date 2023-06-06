<script lang="ts">
	import ItemList from "../ItemList.svelte";

    let listItems: ListItem[] = []
    let setupItemList = () => {
        // Populate with email link
        listItems.push({
            id: 0,
            name: "Contact me",
            img: "email.svg",
            action: () => {
                window.location.href = "mailto:kevin.brousseau98@gmail.com"
            }
        })
    }
    setupItemList()

</script>

<div class="container screenPadding">
    
<h2>About This Platform</h2> 
<p>
    <br><br>Welcome to this innovative digital tarot platform, where the ancient wisdom of tarot meets the power of cutting-edge AI and web technologies. As an early-stage startup, our singular aim is to create an immersive, personalized, and unique experience.
    
    <br><br>In the early stages of our journey, we are building a platform that empowers individuals to delve into the depths of introspection and spiritual growth through tarot reading. You can draw your own cards or let the <b>energies</b> choose for you. And with our premium feature, using tokens – our in-site currency – you can opt for an in-depth analysis of your chosen spread for deeper insights.
    
    <br><br>We're in the initial phases of creating a new narrative for online tarot reading and are currently seeking our first potential partners. We are actively looking for artists, creators, and collaborators to grow with us. As part of our expansion strategy, we aim to add more art and tarot decks to our platform. Our revenue-sharing model ensures that every deck purchase supports the contributing artists directly, making our platform a thriving and inclusive creative hub.
    
    <br><br>As we embark on this journey, we are looking for like-minded individuals, seekers, and creators who believe in our mission and are ready to revolutionize the tarot reading experience together. We believe that by blending the old and the new, we can craft an incredible journey of self-discovery and spiritual exploration for our users. And, together with our first partners, we are confident we can create an experience unlike any other.
    
    <br><br>We welcome you to join us, help shape this vibrant world of tarot, and contribute to a shared vision of blending ancient wisdom with modern technology. 
</p>

<ItemList items={listItems}></ItemList>
</div>

<style lang="scss">

    h2{
        margin-top: 2rem;
    }
    .container{
        margin-top: 3rem;
        max-width: 40rem;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        h2{
            text-align: center;
        }
    }

</style>