<script lang="ts">
  import { Menubar } from "bits-ui";

  export let title: string;
</script>

<Menubar.Menu>
  <Menubar.Trigger class="h-full px-1.5 hover:bg-neutral-8/50">
    <div class="translate-y-0.2">
      {title}
    </div>
  </Menubar.Trigger>
  <Menubar.Content class="min-w-50 flex flex-col bg-neutral-8" align="start">
    <slot />
  </Menubar.Content>
</Menubar.Menu>
