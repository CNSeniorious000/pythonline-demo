<script context="module" lang="ts">
  import { writable } from "svelte/store";

  export const focusedFile = writable<string | undefined>();
</script>

<script lang="ts">
  import FileContent from "./FileContent.svelte";
  import FileList from "./FileList.svelte";
  import { registerCommandGroup } from "$lib/components/command/helper";
  import Console from "$lib/components/Console.svelte";
  import SetupWorkspace from "$lib/components/reusable/WorkspaceLifecycle.svelte";
  import { toastMarkdown } from "$lib/utils/toast";
  import { Pane, PaneGroup, PaneResizer } from "paneforge";

  export let sources: Record<string, string> = {};

  function getDefaultFile() {
    const readmeFiles = Object.keys(sources).filter(name => name.toUpperCase().includes("README"));
    if (readmeFiles.length === 0)
      return Object.keys(sources)[0];
    return readmeFiles.reduce((longest, current) => sources[current].length > sources[longest].length ? current : longest, readmeFiles[0]);
  }

  $focusedFile = getDefaultFile();
  let container: HTMLElement;

  $: registerCommandGroup("工作区", Object.keys(sources).map(name => ({
    text: `打开 ${name}`,
    handler() {
      $focusedFile = name;
    },
  })));

  $: if ($focusedFile && !($focusedFile in sources)) {
    $focusedFile = undefined;
  }
</script>

<div class="h-full">
  <PaneGroup direction="horizontal">
    <Pane defaultSize={20} minSize={10}>
      <FileList files={Object.keys(sources).toSorted()} bind:focusedFile={$focusedFile} />
    </Pane>
    <PaneResizer class="group">
      <div class="mx-1 h-full w-0.11em bg-white/10 transition group-active:bg-current group-hover:bg-white/30" />
    </PaneResizer>
    <Pane defaultSize={80} minSize={10}>
      <PaneGroup direction="vertical">
        <SetupWorkspace {sources} let:save>
          <Pane defaultSize={70} minSize={10} class="relative">
            {#if $focusedFile}
              <FileContent on:save={({ detail: content }) => {
                // @ts-ignore
                save($focusedFile, content.replaceAll("\r\n", "\n"));
                toastMarkdown(`\`${$focusedFile}\` 已保存`);
              }} bind:content={sources[$focusedFile]} lang={$focusedFile.slice($focusedFile.lastIndexOf(".") + 1)} />
            {:else}
              <div class="grid h-full w-full place-items-center">
                <div class="text-sm text-neutral-6">打开或新建一个文件以编辑</div>
              </div>
            {/if}
          </Pane>
          <PaneResizer class="group">
            <div class="my-1 h-0.11em w-full bg-white/10 transition group-active:bg-current group-hover:bg-white/30" />
          </PaneResizer>
          <Pane defaultSize={30} minSize={10}>
            <div class="h-full w-full overflow-y-scroll" bind:this={container}>
              <Console class="p-2 text-xs [&>div:hover]:rounded-r-none @2xl:(text-13px line-height-18px) @7xl:text-sm" {container} />
            </div>
          </Pane>
        </SetupWorkspace>
      </PaneGroup>
    </Pane>
  </PaneGroup>
</div>
