<script context="module" lang="ts">
  import Chat from "./Chat.svelte";
  import { writable } from "svelte/store";

  let index = 0;

  const conversations = writable<number[]>([]);

  export function newChat() {
    conversations.update($conversations => [...$conversations, index++]);
  }
</script>

{#each $conversations as i (i)}
  <div class="pointer-events-none fixed inset-0 grid place-items-center [&>*]:pointer-events-auto">
    <Chat close={() => [$conversations = $conversations.filter(index => (index !== i)), close()]} />
  </div>
{/each}
