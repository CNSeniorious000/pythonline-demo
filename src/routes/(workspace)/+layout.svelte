<script context="module" lang="ts">
  import type { Spring } from "svelte/motion";

  import Drop from "./Drop.svelte";
  import { writable } from "svelte/store";

  let progress: Spring<number>;
  let reset: () => any;
  const tasks = writable<[number, number]>([0, 0]);

  const ONE_THIRD = 1 / 3;

  function addTask() {
    tasks.update(([total, finished]) => {
      total++;
      return [total, finished];
    });
  }

  function finish() {
    tasks.update(([total, finished]) => {
      finished++;
      if (total <= finished) {
        progress.set(2, { soft: true });
        return [0, 0];
      }
      return [total, finished];
    });
  }

  function cancel() {
    tasks.update(([total, finished]) => {
      total--;
      if (total === finished) {
        progress.set(0);
        return [0, 0];
      }
      return [total, finished];
    });
  }

  export async function withProgress<T>(promise: Promise<T>) {
    addTask();
    try {
      const res = await promise;
      finish();
      return res;
    }
    catch (e) {
      cancel();
      throw e;
    }
  }
</script>

<script lang="ts">
  import Menu from "./Menu.svelte";
  import { showEditor, sources } from "./store";
  import Workspace from "./Workspace.svelte";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { currentConsole } from "$lib/components/console/store";
  import Progress from "$lib/components/Progress.svelte";
  import { onDestroy } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";

  beforeNavigate(addTask);
  afterNavigate(finish);

  afterNavigate(() => {
    $currentConsole?.clear();
  });

  onDestroy(() => {
    // @ts-ignore
    reset = undefined;
  });

  let show: boolean;

  $: {
    const [total, finished] = $tasks;

    if (total === 1 && finished === 0) {
      reset?.();
      progress.set(0.25);
      show = true;
    }
    else if (total === finished) {
      show = false;
    }
    else {
      show = true;
      progress.set((ONE_THIRD + finished) / (ONE_THIRD + total), { soft: 1 });
    }
  }
</script>

<slot />

<div class="h-8" class:-translate-y-8={!$showEditor}>
  <Menu />
</div>

{#if $showEditor}
  <div class="h-[calc(100vh-2rem)]" in:fade={{ delay: 100, easing: cubicOut }} out:fly={{ y: -5, duration: 150 }}>
    <Workspace bind:sources={$sources} />
  </div>
{/if}

<div class="absolute top-0 z-1 w-full [&>div]:transition-opacity [&_*]:!rounded-none" class:translate-y-7={$showEditor}>
  <Progress {show} bind:progress bind:reset />
</div>

<Drop />

<style>
  * {
    --uno: transition-transform;
  }
</style>
