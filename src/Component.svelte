<script>
  import { getContext } from "svelte";
  import { SuperTable } from "@poirazis/supercomponents-shared";

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  export let dataSource;
  export let isTable;
  export let flex = "none";

  // Builder Code to identify if we are dealing with a Table or View Datasource
  $: localIsTable = dataSource?.type == "table" || dataSource?.tableId;
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
      flex,
      display: "flex",
      ...$component.styles.normal,
    },
  };
</script>

<div use:styleable={$component.styles}>
  <SuperTable
    comp_id={$component.id}
    inBuilder={$builderStore.inBuilder}
    {...$$props}
  >
    <slot />
  </SuperTable>
</div>
