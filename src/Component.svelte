<script>
  import { getContext } from "svelte";
  import SuperTable from "../../bb_super_components_shared/src/lib/SuperTable/SuperTable.svelte";

  const { styleable } = getContext("sdk");
  const component = getContext("component");
</script>

<div use:styleable={$component.styles}>
  <SuperTable {...$$props}>
    <slot />
  </SuperTable>
</div>