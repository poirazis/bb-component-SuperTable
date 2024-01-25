<script>
  import { getContext } from "svelte";
  import { SuperTable } from "../../bb_super_components_shared/src/lib"

  const { styleable } = getContext("sdk");
  const component = getContext("component");

  export let datasource
  export let idColumn;
  export let sortColumn
  export let sortOrder
  export let limit = 50
  export let fetchOnScroll
  export let fetchPageSize
  export let paginate
  export let visibleRowCount;
  export let filter = {}
  export let showFooter;
  export let showHeader;
  export let size;
  export let canInsert, canDelete, canEdit, canSort, canResize, canFilter
  export let superColumnsPos;
  export let columnList = []
  export let debounce = 750
  export let autoRefresh = false
  export let autoRefreshRate = 60
  export let theme = "budibase"
  export let useOptionColors = true
  export let optionsViewMode = "pills"
  export let relViewMode = "pills"

  export let rowSelectMode
  export let selectionColumn

  export let columnSizing
  export let columnMinWidth = "6rem"
  export let columnMaxWidth
  export let columnFixedWidth

  export let headerFontSize, headerColor, headerBgColor, headerAlign;
  export let dividers, dividersColor;

  export let rowVerticalAlign,
    rowHorizontalAlign,
    rowFontSize,
    rowFontColor,
    rowBackground;

  export let footerAlign, footerFontSize, footerFontColor, footerBackground;
  export let cellPadding = 8
  export let rowHeight 

  // Events
  export let onRowSelect;
  export let onCellChange;
  export let onRowClick;
  export let onRowDblClick;

  $: tableOptions = {
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
    debounce,
    visibleRowCount,
    rowSelectMode,
    selectionColumn,
    dividers,
    dividersColor,
    baseFontSize: 14,
    rowHeight: 38,
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
    features: {
      canInsert,
      canEdit,
      canDelete,
      canFilter,
      canSort
    },
    data: { 
      datasource,
      idColumn,
      filter,
      sortColumn,
      sortOrder,
      limit,
      paginate,
      autoRefresh,
      autoRefreshRate,
      fetchOnScroll,
      fetchPageSize
    },
    columns: columnList,
    appearance: {
      theme,
      size,
      cellPadding,
      useOptionColors,
      optionsViewMode,
      relViewMode
    },
    events: {
      onRowClick,
      onRowDblClick,
      onCellChange,
      onRowSelect,
    }
  };

</script>

<div use:styleable={$component.styles}>
  <SuperTable {tableOptions}>
    <slot />
  </SuperTable>
</div>