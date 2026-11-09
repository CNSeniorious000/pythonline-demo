<script lang="ts">
  import Notebook from "./notebook/Notebook.svelte";
  import WithTooltip from "./reusable/WithTooltip.svelte";
  import SkeletonLine from "./SkeletonLine.svelte";
  import { draggable } from "@neodrag/svelte";
  import { explain } from "$lib/pyodide/api/explain";
  import { onMount } from "svelte";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";

  interface ErrorInfo { traceback: string; code: string }

  export let errorInfo: ErrorInfo | undefined;
  export let close: () => any;

  let output = "";
  let error: Error | undefined;

  async function runExplain({ traceback, code }: ErrorInfo) {
    try {
      for await (const delta of explain(traceback, code))
        output += delta;
    }
    catch (e) {
      error = e as Error;
    }
  }

  function invoke() {
    if (errorInfo) {
      output = "";
      error = undefined;
      runExplain(errorInfo);
    }
  }

  onMount(invoke);

  let ref: HTMLDivElement;
</script>

<div class="mt-10 h-full max-w-[calc(100vw-40px)] w-full sm:mt-30vh lg:max-w-xl sm:max-w-lg sm:w-3/4">
  <div in:scale|global={{ start: 0.9, easing: cubicOut }} out:scale|global={{ start: 0.95, easing: cubicIn }} use:draggable={{ applyUserSelectHack: false, cancel: ref, bounds: { left: 20, top: 20, right: 20, bottom: 20 } }} class="cursor-grab rounded bg-neutral-8/60 ring-0.9 ring-white/20 backdrop-blur-lg xl:max-w-3xl lg:ring-1.3 sm:ring-1.1">
    <div class="max-h-[calc(100vh-40px)] w-full flex flex-col gap-3 overflow-y-hidden bg-neutral-9/40 p-3 sm:gap-4 lg:p-4 sm:p-3.5" class:!pb-0={!error}>
      <div class="flex flex-row select-none items-center justify-between">
        <div class="flex flex-row items-center gap-1.5 rounded bg-emerald-3/10 px-1.5 py-1 text-emerald-3/80">
          <div class="i-majesticons-lightbulb-shine text-base text-emerald-3" />
          <div class="text-xs capitalize sm:text-sm">
            报错解释与修复
          </div>
        </div>
        <div class="flex flex-row [&>button:active]:scale-90 [&>button]:(rounded p-1.5 text-white/80 transition-colors)">
          <WithTooltip tips="重新生成" let:builder>
            <button class="hover:(bg-cyan-3/10 text-cyan-3/80)" on:click={invoke} {...builder} use:builder.action>
              <div class="i-mingcute-refresh-2-fill" />
            </button>
          </WithTooltip>
          <WithTooltip tips="关闭" let:builder>
            <button class="hover:(bg-red-3/10 text-red-3/80)" on:click={close} {...builder} use:builder.action>
              <div class="i-mingcute-close-fill" />
            </button>
          </WithTooltip>
        </div>
      </div>
      <div class="contents cursor-auto" bind:this={ref}>
        {#if error}
          <div class="overflow-x-scroll overflow-x-scroll rounded bg-orange-3/5 text-xs text-orange-3">
            <pre class="px-2.5 py-2 font-mono">{error.message}</pre>
          </div>
        {:else}
          <div class="overflow-y-scroll pb-2.5 lg:pb-3.5 sm:pb-3 [&>article_:where(h1,h2,h3,h4,h5,h6)]:(text-1.1em font-400) [&>article]:(<sm:text-xs lg:text-base)">
            {#if output}
              <Notebook text={output} />
            {:else}
              <SkeletonLine />
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
