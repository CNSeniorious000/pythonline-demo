<script lang="ts">
  import type { WorkspaceInfo } from "$lib/cms/types";

  import { withProgress } from "./+layout.svelte";
  import Group from "./MenuGroup.svelte";
  import Item from "./MenuItem.svelte";
  import { sources } from "./store";
  import { telegraphToken } from "./telegraph/store";
  import { focusedFile } from "./Workspace.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { forkWorkspace, updateWorkspace } from "$lib/cms/telegraph";
  import { input } from "$lib/components/Input.svelte";
  import { Menubar } from "bits-ui";

  async function newFile() {
    const path = await input("文件路径");
    if (path) {
      $sources = { ...$sources, [path]: "" };
      $focusedFile = path;
    }
  }

  async function share() {
    const [title, author] = await Promise.all([input("标题"), input("作者")]);
    const payload: WorkspaceInfo = { sources: $sources, title, author };
    await withProgress((async () => {
      const { path, token } = await forkWorkspace(payload, $telegraphToken);
      token && telegraphToken.set(token);
      await goto(`/telegraph/${path}`);
    })());
  }

  async function update() {
    const [title, author] = await Promise.all([input("标题"), input("作者")]);
    await withProgress(updateWorkspace({ title, author, sources: $sources, token: $telegraphToken! }));
  }

  $: canUpdate = $telegraphToken && $page.route.id === "/(workspace)/telegraph/[path]";
</script>

<Menubar.Root class="h-full flex flex-row items-center">

  <button on:click={() => history.back()} class="group z-1 h-full text-neutral-3 [&:active>div>div]:(scale-80 duration-100) hover:(bg-neutral-8 text-neutral-2)">
    <div class="pointer-events-none relative mx-2 aspect-1 h-1/2 [&>div]:(absolute inset-0 h-full w-full transition duration-250 ease-out)">
      <div class="i-mdi-language-python group-hover:(op-0 -translate-x-1.5)" />
      <div class="i-iconamoon-arrow-left-1-bold group-not-hover:(translate-x-1.5 op-0)" />
    </div>
  </button>

  <Group title="文件">
    <Item icon="i-carbon-document-add -translate-y-0.2" on:click={newFile}>新建文件</Item>
  </Group>

  <Group title="项目">
    <Item icon="i-carbon-save -translate-y-0.2" on:click={update} disabled={!canUpdate}>保存（更新）</Item>
    <Item icon="i-carbon-share" on:click={share}>分支（另存为）</Item>
  </Group>

</Menubar.Root>
