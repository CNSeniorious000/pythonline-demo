<script context="module" lang="ts">
  import type { WorkspaceAPI } from "$py/workspace/workspace";

  import { writable } from "svelte/store";

  export const currentWorkspace = writable<WorkspaceAPI | undefined>();
</script>

<script lang="ts">
  import getPy from "$lib/pyodide";
  import { onDestroy, onMount } from "svelte";

  export let sources: Record<string, string>;

  let workspace: WorkspaceAPI;

  onMount(async () => {
    const py = await getPy({ workspace: true });
    workspace = py.pyimport("workspace.WorkspaceAPI")(py.toPy(sources));
    $currentWorkspace = workspace;
  });

  onDestroy(() => {
    $currentWorkspace = undefined;
    workspace?.close();
    workspace?.destroy();
  });
</script>

<slot sync={workspace?.sync} save={workspace?.save} />
