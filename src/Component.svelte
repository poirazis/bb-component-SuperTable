<script>
  import { getContext } from "svelte";
  import { SuperTable , sizingMap } from "../../bb_super_components_shared/src/lib"

  const { styleable , fetchDatasourceSchema } = getContext("sdk");
  const component = getContext("component");

  export let datasource
  export let idColumn;
  export let rowLimit = 50
  export let paginate
  export let visibleRowCount;
  export let filter = {}
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
  export let useOptionColors = true
  export let optionsViewMode = "pills"
  export let relViewMode = "pills"

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
  export let onRowSelect;
  export let onDataChange;
  export let onRowClick;
  export let onRowDblClick;

  let tableOptions
  let loaded = false
  let schema
  let loadedDatasource

  $: if ( loadedDatasource != datasource ) loaded = false
  $: fetchSchema(datasource)

  $: tableOptions = {
    hasChildren: $component.children,
    idColumn,
    superColumnsPos,
    canFilter,
    canSort,
    canEdit,
    canDelete,
    canInsert,
    canResize,
    columnSizing,
    columnMaxWidth,
    columnMinWidth,
    columnFixedWidth,
    filteringMode,
    debounce,
    autoRefresh,
    autoRefreshRate,
    submitOn,
    visibleRowCount,
    rowSelectMode,
    dividers,
    dividersColor,
    baseFontSize: size != "custom" ? sizingMap[size].rowFontSize : rowFontSize,
    rowHeight: size != "custom" ? sizingMap[size].rowHeight : rowHeight,
    showFooter,
    showHeader,
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
    data: { 
      datasource,
      schema,
      filter
    },
    columns: columnList,
    appearance: {
      theme,
      size,
      cellPadding: size != "custom" ? sizingMap[size].cellPadding : cellPadding,
      useOptionColors,
      optionsViewMode,
      relViewMode
    },
    events:{
      onRowClick,
      onRowDblClick,
      onDataChange,
      onRowSelect,
    }
  };

  const fetchSchema = async datasource => {
    if ( datasource == loadedDatasource ) return

    const res = await fetchDatasourceSchema(datasource)
    schema = res || {}
    if (!loaded) {
      loadedDatasource = datasource
      loaded = true
    }
  }

</script>

<div use:styleable={$component.styles}>
  {#if loaded}
    <SuperTable 
      {tableOptions}
    >
      <slot />
    </SuperTable>
  {/if}
</div>