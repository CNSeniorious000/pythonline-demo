<script lang="ts">
  import { showEditor, sources } from "../store";
  import { goto } from "$app/navigation";
  import Dropzone from "svelte-file-dropzone";

  $showEditor = false;

  const pendingSources: Record<string, string> = {};

  async function handleDrop({ detail: { acceptedFiles } }: CustomEvent<any>) {
    const files = acceptedFiles as (File & { path: string })[];

    await Promise.all(files.map(async (file) => {
      pendingSources[file.path.replace(/^\//, "")] = await file.text();
    }));
  }
</script>

<div class="fixed inset-0 grid place-items-center">
  <div class="m-10 flex flex-col gap-3 sm:max-w-2/3">

    <h1 class="text-lg">从本地选择文件开始</h1>

    <Dropzone class="grid h-fit min-h-40 min-w-xs w-full place-items-center rounded p-4 text-neutral-5 ring-(1.2 neutral-8) sm:min-w-md" disableDefaultStyles on:drop={handleDrop}>
      <ol class="h-fit flex flex-row flex-wrap gap-1.5 text-xs">
        {#each Object.keys(pendingSources) as path}
          <li class="contents">
            <div class="border-1 border-neutral-7 rounded-sm p-1.5 text-neutral-3 font-normal">
              {path}
            </div>
          </li>
        {:else}
          <li class="text-sm text-neutral-5">
            拖放或者点击以选择文件
          </li>
        {/each}
      </ol>
    </Dropzone>

    <button on:click={async () => {
      await goto("/new");
      $sources = pendingSources;
    }} class="w-full flex flex-row justify-center rounded-md bg-neutral-8 p-3 hover:(bg-neutral-3 text-neutral-8)">
      <div class="i-tabler-thumb-up-filled" />
    </button>

  </div>
</div>
