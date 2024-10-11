<script>
  import { getContext } from "svelte";
  import SuperTable from "../../bb_super_components_shared/src/lib/SuperTable/SuperTable.svelte";
  import "../../bb_super_components_shared/src/lib/SuperTable/supertable.css";

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  export let datasource;
  export let isTable;

  // Builder Code to identify if we are dealing with a Table or View Datasource
  $: localIsTable = datasource?.type == "table" || datasource?.tableId;
  $: comp_id = $component.id;
  $: if (
    $builderStore.inBuilder &&
    $component.selected &&
    isTable != localIsTable
  ) {
    builderStore.actions.updateProp("isTable", localIsTable);
  }

  $: $component.styles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      height: $component.styles.normal.height
        ? $component.styles.normal.height
        : 360,
    },
  };
</script>

<div use:styleable={$component.styles}>
  <SuperTable {comp_id} inBuilder={$builderStore.inBuilder} {...$$props}>
    <slot />
  </SuperTable>
</div>
