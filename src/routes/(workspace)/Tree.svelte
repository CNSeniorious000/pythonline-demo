<script context="module" lang="ts">
  const collapseStates = new Map<string, boolean>();
</script>

<script lang="ts">
  import type { File, Folder, Tree } from "$lib/utils/list2tree";

  import { sources } from "./store";
  import { input } from "$lib/components/Input.svelte";
  import { slide } from "svelte/transition";

  export let folder: Folder;
  export let parent = "";
  export let focusedFile: string | null = null;

  let collapse = collapseStates.get(parent) ?? folder.children.length > 20;
  $: collapseStates.set(parent, collapse);

  $: tree = folder.children;

  export let depth = 0;

  function getPath(item: Tree[number]) {
    return parent ? `${parent}/${item.name}` : item.name;
  }

  function countFlattenLength(children: Tree) {
    let length = 0;
    for (const item of children) {
      length++;
      if (item.type === "folder" && !(collapseStates.get(getPath(item)) ?? item.children.length > 5))
        length += countFlattenLength(item.children);
    }
    return length;
  }

  function getFileIcon(item: File) {
    switch (item.name.split(".").at(-1)) {
      case "py":
      case "pyi":
        return "i-catppuccin-python";
      case "j2":
        return "i-catppuccin-jinja";
      case "svelte":
        return "i-catppuccin-svelte";
      case "yml":
      case "yaml":
        return "i-catppuccin-yaml";
      case "toml":
        return "i-catppuccin-toml";
      case "ts":
      case "mts":
      case "cts":
        return "i-catppuccin-typescript";
      case "js":
      case "mjs":
      case "cjs":
        return "i-catppuccin-javascript";
      case "md":
        return "i-catppuccin-markdown";
      default:
        return "i-catppuccin-file";
    }
  }

  function deleteFile(path: string) {
    const { [path]: _, ...rest } = $sources;
    $sources = rest;
  }

  async function renameFile(item: File) {
    const path = getPath(item);
    const name = await input("重命名为", item.name);
    if (name) {
      const { [path]: content, ...rest } = $sources;
      const target = `${parent}/${name}`.replace(/^\//, "");
      $sources = { ...rest, [target]: content };
      focusedFile = target;
    }
  }
</script>

<section data-container>
  {#if parent !== ""}
    <button data-folder style:--depth="{depth - 1 + 0.8}em" on:click={() => collapse = !collapse}>
      <div class={collapse ? "i-catppuccin-folder" : "i-catppuccin-folder-open"} />
      <div>{parent.split("/").at(-1)}</div>
    </button>
  {/if}

  {#if parent === "" || !collapse}

    <section transition:slide={{ duration: 100 * (countFlattenLength(tree) ** 0.4) }}>

      {#each tree as item}
        {#if item.type === "file"}
          <button data-file class="group" style:--depth="{depth + 0.8}em" class:!bg-neutral-8={focusedFile === getPath(item)} on:click={() => (focusedFile = getPath(item))}>
            <div class={getFileIcon(item)} />
            <div>{item.name}</div>
            <div class="absolute right-1 top-1/2 flex flex-row-reverse gap-1 text-neutral-4 transition group-not-hover:(pointer-events-none op-0) -translate-y-1/2 [&>div:hover]:text-neutral-3">
              <!-- svelte-ignore a11y-interactive-supports-focus a11y-click-events-have-key-events -->
              <div role="button" on:click|stopPropagation={() => deleteFile(getPath(item))} class="i-carbon-trash-can" />
              <!-- svelte-ignore a11y-interactive-supports-focus a11y-click-events-have-key-events -->
              <div role="button" on:click|stopPropagation={() => renameFile(item)} class="i-carbon-edit" />
            </div>
          </button>
        {:else}
          <svelte:self folder={item} parent={getPath(item)} depth={depth + 1} bind:focusedFile />
        {/if}
      {/each}

    </section>

  {/if}
</section>

<style>
  section {
    --uno: flex flex-col text-ellipsis ws-nowrap;
  }

  button:where([data-file], [data-folder]) {
    --uno: relative w-full flex shrink-0 flex-row items-center gap-1.4 overflow-x-hidden rounded-r-sm py-0.6 pl-$depth pr-1 text-left text-xs text-neutral-1/95 font-mono transition-background-color duration-100 active:bg-neutral-8/70 hover:bg-neutral-8/50;
  }

  div {
    --uno: shrink-0;
  }

  [data-container] {
    --uno: transition-background-color duration-100;
  }

  [data-container]:has(> button:first-child:hover) {
    --uno: rounded-r-sm bg-neutral-8/10;
  }
</style>
