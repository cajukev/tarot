<script lang="ts">
	import { invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
	import { readingStore } from '../stores';


    let inputVal = '';

    let saveUserInfo = (info: string) => {
        console.log(info);
        fetch('/api/saveInformation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ information: info })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                invalidateAll();
            })
            .catch(err => {
                console.log(err);
            })
    }
</script>

<div class="container">
    <p class="info">
        Information saved in this page will be used to personalize readings. Do not include any sensitive personal information.
    </p>
    <textarea name="" id="" cols="30" rows="10" maxlength="500" bind:value={inputVal} placeholder={$page.data.profile.data.information}></textarea>
    {inputVal.length}/500
    <button class="action" on:click={()=> saveUserInfo(inputVal)}>Save</button>
    <p class="information">
        {$page.data.profile.data.information}
    </p>
    <p class="info">
        Reading length multiplier
    </p>
    <input type="range" min="0.5" max="2" step="0.1" bind:value={$readingStore.multiplier}>
    <p class="information">
        {$readingStore.multiplier}
    </p>
</div>

<style lang="scss">
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0 1rem;
        textarea{
            width: 100%;
            max-width: 40rem;
            height: 10rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            resize: none;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            padding: 0.5rem;
            font-size: 1rem;
        }
        p.information{
            margin-top: 1rem;
            max-width: 40rem;
            word-wrap: break-word;
            white-space: break-spaces;
        }
        p.info{
            text-align: center;
            max-width: 40rem;
            word-wrap: break-word;
            margin-bottom: 1rem;
        }
        button{
            margin-top: 1rem;
        }
    }
</style>