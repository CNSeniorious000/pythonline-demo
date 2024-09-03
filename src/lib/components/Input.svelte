<script context="module" lang="ts">
  import Dialog from "./Dialog.svelte";
  import { writable } from "svelte/store";

  let nonce = 0;

  interface Task {
    id: number;
    prompt: string;
    resolve: (value: string) => any;
  }

  const tasks = writable<Task[]>([]);

  export function input(prompt: any) {
    return new Promise<string>((resolve) => {
      tasks.update(($tasks) => {
        $tasks.push({ prompt, resolve, id: nonce++ });
        return $tasks;
      });
    });
  }
</script>

{#each $tasks as { prompt, resolve, id } (id)}
  <Dialog open message={prompt} title="输入" callback={(value) => {
    resolve(value ?? "");
    $tasks = $tasks.filter(task => task.id !== id);
  }} />
{/each}
