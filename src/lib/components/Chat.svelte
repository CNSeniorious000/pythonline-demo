<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import Notebook from "$lib/components/notebook/Notebook.svelte";
  import WithTooltip from "$lib/components/reusable/WithTooltip.svelte";
  import getPy from "$lib/pyodide";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";

  let input: string;

  let ref: HTMLDivElement;

  export let close: () => any;

  let messages: { role: "user" | "assistant" | "system"; content: string }[] = [];

  async function invokeChat() {
    const py = await getPy({ chat: true });
    const generate = py.pyimport("chat.utils.llm.generate");
    const groundings: string = await py.pyimport("chat.templates.groundings").arender();
    let content = "";
    messages = [...messages, { role: "user", content: input }, { role: "assistant", content }];
    input = "";
    for await (const i of generate(py.toPy([{ role: "system", content: groundings }, ...messages]))) {
      content += i;
      messages = [...messages.slice(0, -1), { role: "assistant", content }];
    }
  }
</script>

<div class="mt-10 h-full max-w-[calc(100vw-40px)] w-full sm:mt-30vh lg:max-w-xl sm:max-w-lg sm:w-3/4">
  <div in:scale={{ start: 0.9, easing: cubicOut }} out:scale={{ start: 0.95, easing: cubicIn }} use:draggable={{ applyUserSelectHack: false, cancel: ref, bounds: { left: 20, top: 20, right: 20, bottom: 20 } }} class="relative max-h-[calc(100vh-40px)] cursor-grab overflow-y-scroll border-(1 white/10) rounded bg-neutral-8/60 ring-0.9 ring-white/20 ring-inset backdrop-blur-lg xl:max-w-3xl lg:ring-1.3 sm:ring-1.1">
    <div class="h-full w-full flex flex-col gap-3 bg-neutral-9/40 px-3 sm:gap-4 lg:px-4 sm:px-3.5">
      <div class="sticky top-0 z-1 flex flex-row select-none items-center justify-between bg-gradient-(from-neutral-9 via-neutral-9/80 to-neutral-9/0 to-b) p-3 -mx-3 -mb-6 lg:p-4 sm:p-3.5 !pb-6 lg:-mx-4 sm:-mx-3.5">
        <div class="flex flex-row items-center gap-2.5 rounded bg-emerald-3/10 px-1.5 py-1 text-emerald-3/80">
          <div class="i-majesticons-lightbulb-shine text-base text-emerald-3" />
          <div class="text-xs capitalize sm:text-sm">
            通用助手
          </div>
        </div>
        <div class="flex flex-row [&>button:active]:scale-90 [&>button]:(rounded p-1.5 text-white/80 transition-colors)">
          <WithTooltip tips="关闭" let:builder>
            <button class="hover:(bg-red-3/10 text-red-3/80)" on:click={close} {...builder} use:builder.action>
              <div class="i-mingcute-close-fill" />
            </button>
          </WithTooltip>
        </div>
      </div>
      <div class="contents cursor-auto text-sm" bind:this={ref}>
        {#each messages as { role, content }}
          {#if content}
            <div class:user={role === "user"} class="[&>article_:where(h1,h2,h3,h4,h5,h6)]:(text-1.1em font-400) [&>article]:(<sm:text-xs lg:text-base)">
              <Notebook text={content} />
            </div>
          {/if}
        {/each}
        <div class="sticky bottom-0 flex flex-row gap-1.5 bg-gradient-(from-neutral-9 via-neutral-9/80 to-neutral-9/0 to-t) p-3 -mx-3 -mt-6 lg:p-4 sm:p-3.5 !pt-6 lg:-mx-4 sm:-mx-3.5">
          <!-- svelte-ignore a11y-autofocus -->
          <input autofocus placeholder="问我任何事情" class="w-full rounded bg-neutral-8/80 px-2 py-1 text-neutral-2 outline-none placeholder-neutral-6" on:keydown={({ key }) => key === "Enter" && invokeChat()} bind:value={input} type="text">
          <button on:click={invokeChat}>
            <div class="i-tabler-square-rounded-chevron-up-filled text-2xl text-neutral-4"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .user {
    --uno: bg-white/5 px-3 py-1 -mx-3 lg:(px-4 -mx-4) sm:(px-3.5 -mx-3.5);
  }
</style>
