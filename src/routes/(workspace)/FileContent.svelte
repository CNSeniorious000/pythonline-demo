<script lang="ts">
  import Editor from "$lib/components/Editor.svelte";
  import Notebook from "$lib/components/notebook/Notebook.svelte";
  import { Pane, PaneGroup, PaneResizer } from "paneforge";

  export let content: string;
  export let lang: string;

  function getLanguage(ext: string) {
    switch (ext) {
      case "j2":
        return "jinja";
      case "pyi":
        return "python";
      default:
        return ext;
    }
  }
</script>

<PaneGroup direction="horizontal" class="h-full w-full">
  <Pane minSize={15}>
    <Editor on:save lang={getLanguage(lang)} showLineNum bind:source={content} />
  </Pane>
  {#if lang === "md"}
    <PaneResizer class="group">
      <div class="mx-1 h-full w-0.11em bg-white/10 transition group-active:bg-current group-hover:bg-white/30" />
    </PaneResizer>
    <Pane minSize={15} class="@container">
      <section class="relative h-full [&>article>*]:text-base">
        <div class="pointer-events-none absolute top-0 z-1 h-5 w-full bg-gradient-(from-neutral-9 to-neutral-9/0 to-b) @lg:h-7" />
        <Notebook text={content} />
        <div class="pointer-events-none absolute bottom-0 z-1 h-5 w-full bg-gradient-(from-neutral-9/80 to-neutral-9/0 to-t) @lg:h-7" />
      </section>
    </Pane>
  {/if}
</PaneGroup>

<style>
  section > :global(article) {
    --uno: h-full overflow-scroll p-5 @lg:p-7;
  }
</style>
