<script lang="ts">
  import { Menubar } from "bits-ui";

  export let icon: string;
</script>

<Menubar.Item asChild let:builder>
  <button class="flex flex-row items-center gap-1.3 rounded-sm px-2 py-1 text-left active:(bg-neutral-6 text-neutral-1) hover:(bg-neutral-6/50 text-neutral-2)" on:click {...builder} use:builder.action>
    <div class="{icon} text-base op-40" />
    <slot />
  </button>
</Menubar.Item>
