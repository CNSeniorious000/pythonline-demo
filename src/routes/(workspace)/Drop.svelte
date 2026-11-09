<script context="module" lang="ts">
  import Drop from "$lib/components/Drop.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { writable } from "svelte/store";
  import { scale } from "svelte/transition";

  let resolve = (_: Record<string, string>) => {};

  const show = writable(false);

  export function requestDrop(): Promise<Record<string, string>> {
    return new Promise((r) => {
      show.set(true);
      resolve = r;
    });
  }
</script>

<Modal show={$show}>
  <div class="max-w-1/2 rounded-lg bg-neutral-8/50 p-5 shadow-md" transition:scale={{ start: 0.95 }}>
    <Drop on:collected={(({ detail: sources }) => [resolve(sources), ($show = false)])} />
  </div>
</Modal>
