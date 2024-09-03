<script context="module" lang="ts">
  import type { Spring } from "svelte/motion";

  import { writable } from "svelte/store";

  let progress: Spring<number>;
  let reset: () => any;
  const show = writable(false);

  function start() {
    reset();
    show.set(true);
    progress.set(0.25);
  }

  function end() {
    progress.set(2, { soft: 1 });
    show.set(false);
  }

  function cancel() {
    progress.set(0);
    show.set(false);
  }

  export async function withProgress<T>(promise: Promise<T>) {
    start();
    try {
      const res = await promise;
      end();
      return res;
    }
    catch (e) {
      cancel();
      throw e;
    }
  }
</script>

<script>
  import Menu from "./Menu.svelte";
  import { showEditor, sources } from "./store";
  import Workspace from "./Workspace.svelte";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import Progress from "$lib/components/Progress.svelte";
  import { onDestroy } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";

  beforeNavigate(start);
  afterNavigate(end);

  onDestroy(() => {
    // @ts-ignore
    reset = undefined;
  });
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

<div class="absolute top-0 w-full [&>div]:transition-opacity [&_*]:!rounded-none" class:translate-y-7={$showEditor}>
  <Progress bind:show={$show} bind:progress bind:reset />
</div>

<style>
  * {
    --uno: transition-transform;
  }
</style>
