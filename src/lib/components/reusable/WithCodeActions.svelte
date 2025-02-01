<script lang="ts">
  import type { Code, Node } from "mdast";

  import { currentConsolePush } from "../console/store";
  import UseCopy from "../console/UseCopy.svelte";
  import WithTooltip from "../reusable/WithTooltip.svelte";

  export let node: Node;
  export let run: ((source: string) => any) | null = null;
  export let fadeIn = false;
  export let runnable: boolean | null = null;

  $: code = node as Code;

  $: runnable = runnable || Boolean(code.lang && run && "python".startsWith(code.lang));
</script>

{#if code.value}
  <div class="group relative flex flex-col animate-(duration-150 ease-out)" class:animate-fade-in={fadeIn}>

    <slot {code} />

    <div class="absolute right-0.9em top-0.9em flex flex-row-reverse gap-0.3em transition group-not-hover:(pointer-events-none op-0) [&>button]:(rounded bg-white/5 p-0.6em text-0.725em transition) [&>button:hover]:(bg-white/10)">
      <UseCopy text={code.value} let:handleClick>
        <WithTooltip let:builder tips="复制">
          <button on:click={handleClick} {...builder} use:builder.action><div class="i-icon-park-twotone-copy" /></button>
        </WithTooltip>
      </UseCopy>
      {#if runnable && run}
        <WithTooltip let:builder tips="运行">
          <button on:click={() => run(code.value)} {...builder} use:builder.action><div class="i-mingcute-play-fill" /></button>
        </WithTooltip>
      {/if}
      {#if runnable && $currentConsolePush}
        <WithTooltip let:builder tips="在终端中运行">
          <button on:click={() => {
            const source = code.value.trimEnd();
            if (source.split("\n").at(-1)?.startsWith(" "))
              $currentConsolePush(`${source}\n\n`);
            else
              $currentConsolePush(`${source}\n`);
          }} {...builder} use:builder.action><div class="i-mdi-console" /></button>
        </WithTooltip>
      {/if}
    </div>
  </div>
{/if}

<style>
  div:not(:has(>div>button:active)) :global(pre > *)  {
    --uno: transition-font-weight duration-400 ease-out;
  }

  div:has(>div>button:active) :global(pre *) {
    --uno: font-black;
  }
</style>
