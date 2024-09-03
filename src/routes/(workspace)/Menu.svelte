<script lang="ts">
  import type { WorkspaceInfo } from "$lib/cms/types";

  import Group from "./MenuGroup.svelte";
  import Item from "./MenuItem.svelte";
  import { sources } from "./store";
  import { pushState } from "$app/navigation";
  import { page } from "$app/stores";
  import { saveWorkspace } from "$lib/cms/telegraph";
  import { input } from "$lib/components/Input.svelte";
  import { Menubar } from "bits-ui";

  async function share() {
    const [title, author] = await Promise.all([input("标题"), input("作者")]);
    const payload: WorkspaceInfo = { sources: $sources, title, author };
    const res = await saveWorkspace(payload);
    pushState(`/telegraph/${res.path}`, $page.state);
  }

</script>

<Menubar.Root class="h-full flex flex-row items-center text-sm text-neutral-3 !z-1000000000">

  <div class="i-mdi-language-python ml-2 mr-1.5 text-base" />

  <Group title="项目">
    <Item on:click={share}>分享代码片段</Item>
  </Group>

</Menubar.Root>
