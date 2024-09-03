<script>
  import Menu from "./Menu.svelte";
  import { showEditor, sources } from "./store";
  import Workspace from "./Workspace.svelte";
</script>

<slot />

{#if $showEditor}
  <div class="h-8">
    <Menu />
  </div>
  <div class="h-[calc(100vh-2rem)]">
    <Workspace bind:sources={$sources} />
  </div>
{/if}
