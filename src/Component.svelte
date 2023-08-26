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
  export let superColumnsPos;
  export let columnList = []
  export let filteringMode = "debounced"
  export let debounce = 750

  export let columnWidth
  export let columnMaxWidth
  export let columnSizing

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

  let loading = false

  
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
    columnSizing: columnSizing,
    columnWidth: columnWidth,
    columnMaxWidth: columnMaxWidth,
    superColumnsPos: superColumnsPos,
    filtering: filtering,
    filteringMode: filteringMode,
    debounce: debounce,
    sorting: sorting,
    editable: editable,
    visibleRowCount: visibleRowCount,
    rowSelection: rowSelection,
    dividers: dividers,
    dividersColor: dividersColor,
    cellPadding: size != "custom" ? sizingMap[size].cellPadding : cellPadding,
    rowHeight: size != "custom" ? sizingMap[size].rowHeight : rowHeight,
    showFooter: showFooter,
    onRowClick: onRowClick,
    onDataChange: onDataChange,
    onRowSelect: onRowSelect
  };


</script>

<div use:styleable={$component.styles}>
  <SuperTable 
    {tableOptions} 
    {dataProvider}
    {loading}
  >
    <slot />
  </SuperTable>
</div>
