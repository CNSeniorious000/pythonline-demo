<script lang="ts">
  import { Menubar } from "bits-ui";

  export let icon: string;
  export let disabled = false;
</script>

<Menubar.Item asChild let:builder>
  <button {disabled} class="w-full flex flex-row items-center gap-1.3 rounded-sm px-2 py-1 text-left disabled:op-40 not-disabled:active:(bg-neutral-6 text-neutral-1) not-disabled:hover:(bg-neutral-6/50 text-neutral-2)" on:click {...builder} use:builder.action>
    <div class="{icon} text-base op-40" />
    <slot />
  </button>
</Menubar.Item>
