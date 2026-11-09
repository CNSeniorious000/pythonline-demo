<script lang="ts">
  import { showEditor, sources } from "../store";
  import { goto } from "$app/navigation";
  import Drop from "$lib/components/Drop.svelte";

  $showEditor = false;
</script>

<div class="absolute grid min-h-screen w-full place-items-center p-10">
  <Drop on:collected={async ({ detail: pendingSources }) => {
    await goto("/new");
    $sources = pendingSources;
  }} />
</div>
