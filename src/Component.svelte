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
  export let columnList = []

  export let dividers, dividersColor;
  export let headerAlign, headerFontSize, headerFontColor, headerBackground;
  export let rowVerticalAlign,
    rowHorizontalAlign,
    rowFontSize,
    rowFontColor,
    rowBackground;
  export let footerAlign, footerFontSize, footerFontColor, footerBackground;
  export let rowHorizontalPadding;
  export let rowHeight 

  // Events
  export let onRowSelect;
  export let onDataChange;
  export let onRowClick;

  function getAllColumns() {
    let allColumns
    allColumns = Object.keys(dataProvider.schema).map( v => { return { name: v, displayName: v } } )
    return allColumns
  }

  $: tableOptions = {
    componentID: $component.id,
    hasChildren: $component.children,
    columns: !$component.children && columnList?.length === 0 ? getAllColumns() : columnList,
    idColumn: idColumn,
    superColumnsFirst: superColumnsFirst,
    size: size,
    customSize: {
      rowHeight: rowHeight,
      cellLeftPadding: rowHorizontalPadding
    },
    visibleRowCount: visibleRowCount,
    rowSelection: rowSelection,
    dividers: dividers ?? "Horizontal",
    tableEvents: {
      onRowClick: onRowClick
    },
    columnOptions: {
      showFooter: showFooter,
      rowBackground : rowBackground,
      rowHorizontalPadding : rowHorizontalPadding,
    }
  };

  $: console.log(tableOptions)
</script>

<div use:styleable={$component.styles}>
  <SuperTable 
    {tableOptions} 
    {dataProvider}
  >
    <slot />
  </SuperTable>
</div>
