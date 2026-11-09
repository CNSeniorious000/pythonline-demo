<script lang="ts">
  import type { PageServerData } from "./$types";

  import { showEditor, sources } from "../../../store";

  export let data: PageServerData;

  $sources = data.sources;
  $showEditor = true;
</script>
