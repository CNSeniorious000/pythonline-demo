<script lang="ts">
  import { Menubar } from "bits-ui";

</script>

<Menubar.Item asChild let:builder>
  <button class="px-4 py-1 text-left text-sm hover:bg-neutral-7" on:click {...builder} use:builder.action>
    <slot />
  </button>
</Menubar.Item>
