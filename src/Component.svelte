<script>
  import { getContext } from "svelte";
  import { SuperTable } from "../lib/SuperTable";
  import { sizingMap } from "../lib/SuperTable/themes/superTableThemes";

  const { styleable } = getContext("sdk");
  const component = getContext("component");

  export let dataProvider;
  export let idColumn;
  export let visibleRowCount;
  export let rowSelection;
  export let showFooter;
  export let size;
  export let filtering 
  export let sorting;
  export let editable;
  export let superColumnsFirst;
  export let columnList = []
  export let debounce = 500

  export let dividers, dividersColor;
  export let headerAlign, headerFontSize, headerFontColor, headerBackground;
  export let rowVerticalAlign,
    rowHorizontalAlign,
    rowFontSize,
    rowFontColor,
    rowBackground;
  export let footerAlign, footerFontSize, footerFontColor, footerBackground;
  export let cellPadding;
  export let rowHeight 

  // Events
  export let clickBehaviour
  export let onRowSelect;
  export let onDataChange;
  export let onRowClick;

  
  function getAllColumns( includeAuto ) {
    let allColumns
    allColumns = Object.keys(dataProvider.schema)
    .filter( v => dataProvider.schema[v].autocolumn !== !includeAuto)
    .map( v => { return { name: v, displayName: v } } )
    return allColumns
  }

  $: tableOptions = {
    componentID: $component.id,
    hasChildren: $component.children,
    columns: !$component.children && columnList?.length === 0 ? getAllColumns( false ) : columnList,
    idColumn: idColumn,
    superColumnsFirst: superColumnsFirst,
    filtering: filtering,
    sorting: sorting,
    editable: editable,
    debounce: debounce,
    visibleRowCount: visibleRowCount,
    rowSelection: rowSelection,
    dividers: dividers,
    dividersColor: dividersColor,
    cellPadding: size != "custom" ? sizingMap[size].cellPadding : cellPadding,
    rowHeight: size != "custom" ? sizingMap[size].rowHeight : rowHeight,
    showFooter: showFooter,
    tableEvents: {
      onRowClick: onRowClick  
    },
    onDataChange: onDataChange,
    onRowSelect: onRowSelect
  };

</script>

<div use:styleable={$component.styles}>
  <SuperTable 
    {tableOptions} 
    {dataProvider}
  >
    <slot />
  </SuperTable>
</div>
