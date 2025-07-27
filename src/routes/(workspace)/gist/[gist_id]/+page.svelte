<script lang="ts">
  import type { PageData } from "./$types";

  import { showEditor, sources } from "../../store";

  export let data: PageData;

  $sources = data.sources;
  $showEditor = true;
</script>
