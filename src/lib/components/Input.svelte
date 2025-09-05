<script context="module" lang="ts">
  import Dialog from "./Dialog.svelte";
  import { writable } from "svelte/store";

  let nonce = 0;

  interface Task {
    id: number;
    prompt: string;
    initial: string;
    resolve: (value: string | undefined) => any;
  }

  const tasks = writable<Task[]>([]);

  export function input(prompt: any, initial = "") {
    return new Promise<string | undefined>((resolve) => {
      tasks.update(($tasks) => {
        $tasks.push({ prompt, initial, resolve, id: nonce++ });
        return $tasks;
      });
    });
  }
</script>

{#each $tasks as { prompt, initial, resolve, id } (id)}
  <Dialog open message={prompt} value={initial} title="输入" callback={(value) => {
    resolve(value);
    $tasks = $tasks.filter(task => task.id !== id);
  }} />
{/each}
