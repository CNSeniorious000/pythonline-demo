<script context="module">
  let count = 0;
</script>

<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import { Dialog } from "bits-ui";
  import { cubicOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";

  export let open: boolean;
  export let title: string;
  export let message: string;
  export let callback: (value: string | undefined) => any;

  export let value: string | undefined = "";

  let ref: HTMLInputElement;

  $: if (!open) {
    callback(value);
    count--;
  }
</script>

<Dialog.Root openFocus={() => ref} bind:open portal={null} closeOnEscape={false} closeOnOutsideClick={false} preventScroll={false}>
  <div style:z-index={++count} class="pointer-events-none fixed left-0 right-0 top-30vh grid place-items-center text-neutral-2 [&>*]:pointer-events-auto">

    <Dialog.Overlay asChild let:builder>
      <div transition:fade|global={{ duration: 400, easing: cubicOut }} class="fixed inset-0 bg-black/10 duration-250" {...builder} use:builder.action />
    </Dialog.Overlay>

    <Dialog.Content asChild let:builder>
      <div class="max-w-[calc(100vw-40px)] w-sm translate-x-$i translate-y-$i" style:--i="{count * 1.7}em" transition:scale|global={{ start: 0.98, duration: 250 }} {...builder} use:builder.action>
        <div class="flex flex-col items-center gap-2.5 rounded-lg bg-neutral-8/70 p-4 outline-none ring-0.9 ring-white/20 backdrop-blur-md lg:ring-1.3 sm:ring-1.1" use:draggable={{ cancel: ":not(section,h2)", bounds: { left: 20, top: 20, right: 20, bottom: 20 }, applyUserSelectHack: false }}>
          <section class="w-full flex flex-row cursor-grab items-center justify-between">

            <Dialog.Title class="select-none">
              {title}
            </Dialog.Title>

            <button on:click={() => [(value = undefined), (open = false)]} title="取消" class="rounded-md border-none p-1.5 transition ease-out -m-1.5 active:scale-90 focus-visible:(bg-red-3/10 text-red-3 outline-none ring-1.3 ring-red-3/50) hover:(bg-red-3/10 text-red-3/80)">
              <div class="i-material-symbols-close-rounded" />
            </button>

          </section>

          {#if message !== undefined}
            <Dialog.Description class="<sm:text-sm">
              {message}
            </Dialog.Description>
          {/if}

          <!-- svelte-ignore a11y-positive-tabindex -->
          <input tabindex="1" bind:this={ref} on:keydown={({ key }) => key === "Enter" && (open = false)} placeholder={message} class="mt-1 w-full rounded-sm bg-transparent px-2 py-1.5 text-sky-50 outline-none ring-1.3 ring-white/10 <sm:text-sm focus:ring-white/40 placeholder-neutral-5" bind:value type="text">

        </div>
      </div>
    </Dialog.Content>

  </div>
</Dialog.Root>
