<script lang="ts">
  import { Menubar } from "bits-ui";

</script>

<Menubar.Item asChild let:builder>
  <button class="rounded-sm px-3 py-1 text-left active:(bg-neutral-6 text-neutral-1) hover:(bg-neutral-6/50 text-neutral-2)" on:click {...builder} use:builder.action>
    <slot />
  </button>
</Menubar.Item>
