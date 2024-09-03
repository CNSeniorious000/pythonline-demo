<script lang="ts">
  import type { WorkspaceInfo } from "$lib/cms/types";

  import Group from "./MenuGroup.svelte";
  import Item from "./MenuItem.svelte";
  import { sources } from "./store";
  import { telegraphToken } from "./telegraph/store";
  import { pushState } from "$app/navigation";
  import { page } from "$app/stores";
  import { forkWorkspace, updateWorkspace } from "$lib/cms/telegraph";
  import { input } from "$lib/components/Input.svelte";
  import { Menubar } from "bits-ui";

  async function share() {
    const [title, author] = await Promise.all([input("标题"), input("作者")]);
    const payload: WorkspaceInfo = { sources: $sources, title, author };
    const { path, token } = await forkWorkspace(payload, $telegraphToken);
    pushState(`/telegraph/${path}`, $page.state);
    token && telegraphToken.set(token);
  }

  async function update() {
    const [title, author] = await Promise.all([input("标题"), input("作者")]);
    await updateWorkspace({ title, author, sources: $sources, token: $telegraphToken! });
  }

</script>

<Menubar.Root class="h-full flex flex-row items-center text-sm text-neutral-3 !z-1000000000">

  <div class="i-mdi-language-python ml-2 mr-1.5 text-base" />

  <Group title="项目">
    <Item on:click={update}>保存（更新）</Item>
    <Item on:click={share}>分支（另存为）</Item>
  </Group>

</Menubar.Root>
