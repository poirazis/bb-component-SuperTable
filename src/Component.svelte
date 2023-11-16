<script>
  import { getContext } from "svelte";
  import { dataFilters } from '@budibase/shared-core';
  import { SuperTable } from "../lib/SuperTable";
  import { sizingMap, themeMap } from "../lib/SuperTable/themes/superTableThemes";

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  export let dataProvider;
  export let idColumn;
  export let visibleRowCount;
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

  export let rowSelectMode = "off"

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

  const defaultOperatorMap = {
    "string" : "fuzzy",
    "formula" : "fuzzy",
    "array" : "contains",
    "options" : "equal",
    "datetime" : "rangeLow",
    "boolean" : "equal",
    "number" : "equal",
    "bigint" : "equal",
	}

  const supportFilteringMap = {
    "string" : true,
    "array" : true,
    "options" : true,
    "datetime" : true,
    "boolean" : true,
    "number" : true,
    "bigint" : true,
	}

  const supportSortingMap = {
    "string" : true,
    "formula" : true,
    "array" : true,
    "options" : true,
    "datetime" : true,
    "boolean" : true,
    "number" : true,
    "bigint" : true,
	}

  const supportEditingMap = {
		 "string" : true,
		 "array" : true,
     "link" : true,
		 "options" : true,
		 "datetime" : true,
     "boolean" : true,
     "number" : true,
     "bigint" : true,
	}

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
          canEdit: canEdit && supportEditingMap[dataProvider?.schema[v].type],
          canFilter: canFilter && supportFilteringMap[dataProvider?.schema[v].type],
          canSort: canSort && supportSortingMap[dataProvider?.schema[v].type],
          filteringOperators: dataFilters.getValidOperatorsForType( { type: dataProvider?.schema[v].type } ),
          defaultFilteringOperator: defaultOperatorMap[dataProvider?.schema[v].type],
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
      canEdit: canEdit && supportEditingMap[dataProvider?.schema[bbcolumn.name].type],
      canFilter: canFilter && supportFilteringMap[dataProvider?.schema[bbcolumn.name].type],
      canSort: canSort && supportSortingMap[dataProvider?.schema[bbcolumn.name].type],
      filteringOperators: dataFilters.getValidOperatorsForType( { type: schema[bbcolumn.name].type } ),
      defaultFilteringOperator: defaultOperatorMap[schema[bbcolumn.name].type],
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
    rowSelectMode: rowSelectMode,
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
