<script lang="ts">
  import { Menubar } from "bits-ui";

  export let title: string;

  let open: boolean;
</script>

<Menubar.Menu bind:open>
  <Menubar.Trigger class="h-full px-2 text-0.8rem text-neutral-3 hover:(bg-neutral-8 text-neutral-2)">
    <div class="translate-y-0.25">
      {title}
    </div>
  </Menubar.Trigger>
  <Menubar.Content class="min-w-50 flex flex-col rounded rounded-lt-0 bg-neutral-8 p-1 text-0.8rem text-neutral-3" align="start">
    <slot />
  </Menubar.Content>
</Menubar.Menu>

<style>
  :global([data-state="open"]) {
    --uno: bg-neutral-8 text-neutral-2;
  }
</style>
