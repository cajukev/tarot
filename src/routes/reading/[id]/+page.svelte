<script lang="ts">
	import { readingStore } from "../../../stores";
    import SharedReading from "../../SharedReading.svelte";

    export let data;

    $readingStore = data.data.reading?.reading



</script>

<div class="container">
    <SharedReading></SharedReading>
</div>

<style lang="scss">
</style>