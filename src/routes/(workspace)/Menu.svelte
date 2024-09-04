<script lang="ts">
  import type { WorkspaceInfo } from "$lib/cms/types";

  import { withProgress } from "./+layout.svelte";
  import Group from "./MenuGroup.svelte";
  import Item from "./MenuItem.svelte";
  import { sources } from "./store";
  import { recents, telegraphToken } from "./telegraph/store";
  import { focusedFile } from "./Workspace.svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { forkWorkspace, updateWorkspace } from "$lib/cms/telegraph";
  import { input } from "$lib/components/Input.svelte";
  import { Menubar } from "bits-ui";

  $: metadata = $recents[$page.params.path];

  async function newFile() {
    const path = await input("文件路径，例如 a/b/c.py");
    if (path) {
      $sources = { ...$sources, [path]: "" };
      $focusedFile = path;
    }
  }

  async function newModule(folder = false) {
    const path = await input("模块路径，例如 a.b.c");
    if (path) {
      const target = folder ? `${path.replace(/\./g, "/")}/__init__.py` : `${path.replace(/\./g, "/")}.py`;
      $sources = { ...$sources, [target]: "" };
      $focusedFile = target;
    }
  }

  async function share() {
    const [title = "untitled-project", author = "Anonymous"] = await Promise.all([input("标题", "untitled-project"), input("作者", "Anonymous")]);
    const payload: WorkspaceInfo = { sources: $sources, title, author };
    await withProgress((async () => {
      const { path, token } = await forkWorkspace(payload, $telegraphToken);
      token && telegraphToken.set(token);
      await goto(`/telegraph/${path}`);
      metadata = { title, author, own: true };
      $recents = { ...$recents, [path]: metadata };
    })());
  }

  async function update(updateTitle = false, updateUser = false) {
    const title = updateTitle ? await input("标题", metadata.title) ?? metadata.title : metadata.title;
    const author = updateUser ? await input("作者", metadata.author) ?? metadata.author : metadata.author;
    await withProgress(updateWorkspace({ title, author, sources: $sources, token: $telegraphToken! }));
    await withProgress(invalidateAll());
  }

  $: canUpdate = $telegraphToken && $page.route.id === "/(workspace)/telegraph/[path]" && metadata?.own;
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
    <Menubar.Separator class="my-1 h-1px w-full rounded-full bg-neutral-7" />
    <Item icon="i-carbon-new-tab" on:click={() => newModule(true)}>新建 py 模块（文件夹）</Item>
    <Item icon="i-carbon-new-tab" on:click={() => newModule()}>新建 py 模块（文件）</Item>
  </Group>

  <Group title="项目">
    <Item icon="i-carbon-save -translate-y-0.2" on:click={() => withProgress(update())} disabled={!canUpdate}>保存（更新）</Item>
    <Item icon="i-carbon-share" on:click={share}>分支（另存为）</Item>
    <Menubar.Separator class="my-1 h-1px w-full rounded-full bg-neutral-7" />
    <Item icon="i-carbon-pen-fountain" on:click={() => withProgress(update(false, true))}>修改作者</Item>
    <Item icon="i-carbon-pen" on:click={() => withProgress(update(true, false))}>修改标题</Item>
  </Group>

  <Group title="导航">
    <Item icon="i-carbon-home -translate-y-0.2" on:click={() => goto("/")}>首页</Item>
    <Item icon="i-carbon-repo-source-code" on:click={() => goto("/playground")}>本站 Python 代码</Item>
    <Item icon="i-carbon-time" on:click={() => goto("/recents")}>最近访问</Item>
    <Menubar.Separator class="my-1 h-1px w-full rounded-full bg-neutral-7" />
    <Item icon="i-carbon-link" on:click={() => open("https://py3.online/")}>英文站（较久）</Item>
    <Item icon="i-carbon-logo-github" on:click={() => open("https://github.com/promplate/pyth-on-line")}>开源仓库</Item>
    <Item icon="i-carbon-ai-results-urgent" on:click={() => open("https://github.com/promplate/pyth-on-line/discussions")}>问题反馈</Item>
    <Item icon="i-carbon-feature-membership-filled" on:click={() => open("https://github.com/promplate/pyth-on-line/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22")}>参与贡献</Item>
    <Item icon="i-carbon-logo-github" on:click={() => open("https://github.com/pyodide/pyodide")}>Pyodide 开源仓库</Item>
    <Item icon="i-carbon-logo-github" on:click={() => open("https://github.com/promplate/core")}>Promplate 开源仓库</Item>
    <Item icon="i-carbon-information-square-filled" on:click={() => open("https://docs.py.promplate.dev/")}>Promplate 文档</Item>
    <Item icon="i-carbon-interactive-segmentation-cursor" on:click={() => open("https://promplate.dev/")}>Promplate 交互式文档</Item>
    <Item icon="i-carbon-interactive-segmentation-cursor" on:click={() => open("https://zh.promplate.dev/")}>Promplate 中文交互式文档</Item>
  </Group>

</Menubar.Root>
