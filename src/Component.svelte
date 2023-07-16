<script>
  import { getContext } from "svelte";
  import { SuperTable } from "../lib/SuperTable";

  const { styleable } = getContext("sdk");
  const component = getContext("component");

  export let dataProvider;
  export let idColumn;
  export let visibleRowCount;
  export let rowSelection;
  export let showFooter;
  export let size;
  export let superPowers;
  export let superColumnsFirst;
  export let columnList;

  export let dividers, dividersColor;
  export let headerAlign, headerFontSize, headerFontColor, headerBackground;
  export let rowVerticalAlign,
    rowHorizontalAlign,
    rowFontSize,
    rowFontColor,
    rowBackground;
  export let footerAlign, footerFontSize, footerFontColor, footerBackground;
  export let rowVerticalPadding, rowHorizontalPadding;

  // Events
  export let onRowSelect;
  export let onDataChange;
  export let onRowClick;

  $: tableOptions = {
    componentID: $component.id,
    schema: dataProvider.schema,
    columns: columnList ?? [],
    idColumn: idColumn,
    superColumnsFirst: superColumnsFirst,
    size: size,
    showFooter: showFooter,
    visibleRowCount: visibleRowCount,
    rowSelection: rowSelection,
    dividers: dividers ?? "Horizontal",
    columnOptions: {
      rowBackground : rowBackground
    }
  };
</script>

<div use:styleable={$component.styles}>
  <SuperTable 
    {tableOptions} 
    {dataProvider}
    on:rowClicked = {onRowClick}
  >
    <slot />
  </SuperTable>
</div>
