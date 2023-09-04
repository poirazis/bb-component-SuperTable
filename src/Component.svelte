<script>
  import { getContext } from "svelte";
  import { SuperTable } from "../lib/SuperTable";
  import { sizingMap } from "../lib/SuperTable/themes/superTableThemes";

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  export let dataProvider;
  export let idColumn;
  export let visibleRowCount;
  export let rowSelection;
  export let showFooter;
  export let size;
  export let canInsert, canDelete, canEdit, canSort, canResize, canFilter
  export let superColumnsPos;
  export let columnList = []
  export let filteringMode = "debounced"
  export let debounce = 750
  export let autoRefresh = false
  export let autoRefreshRate = 60

  export let submitOn

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
    let allColumns = []
    if ( dataProvider?.schema ) 
      allColumns = Object.keys(dataProvider.schema)
        .filter( v => dataProvider.schema[v].autocolumn !== !includeAuto)
        .map( v => { return { name: v, displayName: v } } )

    return allColumns
  }

  function saveSettings ( e ) {
    if ( !$builderStore.inBuilder) return;
    
    if ( Array.isArray( e.detail) && e.detail.length > 0 )
      builderStore.actions.updateProp( "columnList", e.detail )

    console.log("Saving Settings")
  }

  const getColumns = ( schema , selectedColumns ) => {
    let newColumns = []
    let schemaColumns = Object.keys(schema) || [];

    // Find Matching Columns
    for ( const column of selectedColumns ) {
      if ( schemaColumns.includes ( column.name ) ) {
        newColumns.push( column )
      }
    }

    if ( newColumns.length == 0 && !$component.children ) {
      newColumns = getAllColumns ( false )
    }

    return newColumns;
  }
  

  $: tableOptions = {
    componentID: $component.id,
    hasChildren: $component.children,
    columns: getColumns(dataProvider.schema, columnList),
    idColumn: idColumn,
    superColumnsPos: superColumnsPos,
    canFilter: canFilter,
    canSort: canSort,
    canEdit: canEdit,
    canDelete: canDelete,
    canInsert: canInsert,
    canResize: canResize,
    columnSizing: columnSizing,
    columnWidth: columnWidth,
    columnMaxWidth: columnMaxWidth,
    filteringMode: filteringMode,
    debounce: debounce,
    autoRefresh: !$builderStore.inBuilder && autoRefresh,
    autoRefreshRate: autoRefreshRate,

    submitOn: submitOn,
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
    on:saveSettings={saveSettings}
    {tableOptions} 
    {dataProvider}
    {loading}
  >
    <slot />
  </SuperTable>
</div>
