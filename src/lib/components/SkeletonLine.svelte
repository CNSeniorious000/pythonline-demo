<script>
  import { onMount } from "svelte";

  let mounted = false;

  onMount(() => {
    requestAnimationFrame(() => mounted = true);
  });
</script>

<div class="relative h-1em w-full animate-pulse overflow-hidden rounded">
  <div class="absolute inset-0 animate-(fade-in duration-300) rounded bg-neutral-1/10 transition-transform-1000" class:-translate-x-full={!mounted} />
</div>
