<script>
  import { getContext } from "svelte";
  import { SuperTable } from "@poirazis/supercomponents-shared";
  import "@poirazis/supercomponents-shared/src/lib/SuperTable/SuperTable.css";

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  export let datasource;
  export let isTable;
  export let flex = "none";

  // Builder Code to identify if we are dealing with a Table or View Datasource
  $: localIsTable = datasource?.type == "table" || datasource?.tableId;
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
      height: 360,
      ...$component.styles.normal,
    },
  };
</script>

<div use:styleable={$component.styles}>
  {#key $component.children}
    <SuperTable inBuilder={$builderStore.inBuilder} {...$$props}>
      <slot />
    </SuperTable>
  {/key}
</div>
