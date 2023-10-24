<script>
  import { getContext } from "svelte";
  import { SuperTable } from "../lib/SuperTable";
  import { sizingMap, themeMap } from "../lib/SuperTable/themes/superTableThemes";

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  export let dataProvider;
  export let idColumn;
  export let visibleRowCount;
  export let rowSelection;
  export let showFooter;
  export let showHeader;
  export let size;
  export let canInsert, canDelete, canEdit, canSort, canResize, canFilter
  export let superColumnsPos;
  export let columnList = []
  export let filteringMode = "debounced"
  export let debounce = 750
  export let autoRefresh = false
  export let autoRefreshRate = 60
  export let theme = "budibase"

  export let columnSizing
  export let columnMinWidth
  export let columnMaxWidth
  export let columnFixedWidth
  export let headerFontSize, headerColor, headerBgColor, headerAlign;

  export let submitOn

  export let dividers, dividersColor;

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
    let allColumns = []
    if ( dataProvider?.schema ) 
      allColumns = Object.keys(dataProvider.schema)
        .filter( v => dataProvider.schema[v].autocolumn !== !includeAuto)
        .map( v => { return { 
          name: v, 
          displayName: v,
          hasChildren: false,
          schema: dataProvider.schema[v],
          hasChildren: false,
          sizing: columnSizing,
          fixedWidth: columnFixedWidth,
          maxWidth: columnMaxWidth,
          minWidth: columnMinWidth,
          showFooter: showFooter,
          showHeader: showHeader,
          canEdit: canEdit,
          canFilter: canFilter,
          padding: size != "custom" ? sizingMap[size].cellPadding : cellPadding,
          headerAlign: "flex-start"
        } } )

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
        newColumns.push(makeSuperColumn (schema,column) )
      }
    }

    if ( newColumns.length == 0 && !$component.children ) {
      newColumns = getAllColumns ( false )
    }

    return newColumns;
  }

  const makeSuperColumn = (schema, bbcolumn ) => {
    let superColumn = {
      ...bbcolumn,
      hasChildren: false,
      schema: schema[bbcolumn.name] ?? {},
      sizing: bbcolumn.width ? "fixed" : columnSizing,
      fixedWidth: bbcolumn.width ? bbcolumn.width : columnFixedWidth,
      maxWidth: columnMaxWidth,
      minWidth: columnMinWidth,
      showFooter: showFooter,
      showHeader: showHeader,
      canEdit: canEdit,
      canFilter: canFilter,
      padding: size != "custom" ? sizingMap[size].cellPadding : cellPadding,
      headerAlign: bbcolumn.align ? bbcolumn.align : "flex-start"
    }
    return superColumn
  }
  
  $: tableTheme = themeMap[theme]
  $: tableColumns = getColumns(dataProvider.schema, columnList)

  $: tableOptions = {
    componentID: $component.id,
    hasChildren: $component.children,
    idColumn: idColumn,
    superColumnsPos: superColumnsPos,
    canFilter: canFilter,
    canSort: canSort,
    canEdit: canEdit,
    canDelete: canDelete,
    canInsert: canInsert,
    canResize: canResize,
    columnSizing: columnSizing,
    columnMaxWidth: columnMaxWidth,
    columnMinWidth: columnMinWidth,
    columnFixedWidth: columnFixedWidth,
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
    showHeader: showHeader,
    onRowClick: onRowClick,
    onDataChange: onDataChange,
    onRowSelect: onRowSelect,
    theme: {},
    defaultColumnOptions: {
      header : {
        color : headerColor,
        bgColor : headerBgColor,
        align : headerAlign
      },
      row : { },
      cell : { },
      footer : { }
    },
    superOptions: {},
    events:{}
  };
</script>

<div use:styleable={$component.styles}>
  <SuperTable 
    on:saveSettings={saveSettings}
    {tableOptions} 
    {tableColumns}
    {tableTheme}
    {dataProvider}
    inBuilder = { $builderStore.inBuilder }
  >
    <slot />
  </SuperTable>
</div>
