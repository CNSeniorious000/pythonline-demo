<script>
  import { showEditor, sources } from "./store";
  import Workspace from "./Workspace.svelte";
</script>

<slot />

{#if $showEditor}
  <div class="h-screen">
    <Workspace bind:sources={$sources} />
  </div>
{/if}
