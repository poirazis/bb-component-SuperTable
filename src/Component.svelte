<script>
  import { getContext } from "svelte";
  import SuperTable from "../../bb_super_components_shared/src/lib/SuperTable/SuperTable.svelte";

  const { styleable } = getContext("sdk");
  const component = getContext("component");

  // Data Related
  export let datasource
  export let idColumn;
  export let sortColumn
  export let sortOrder
  export let limit
  export let fetchOnScroll
  export let fetchPageSize
  export let autoRefresh
  export let autoRefreshRate
  export let paginate
  export let filter
  export let columnList = []
  export let autocolumns 

  export let visibleRowCount;
  export let showFooter;
  export let showHeader;
  export let size;
  export let canInsert, canDelete, canEdit, canSort, canResize, canFilter
  export let showFilterOperators
  export let superColumnsPos;

  export let debounce = 750

  export let rowSelectMode
  export let selectionColumn
  export let selectionLimit

  export let columnSizing
  export let columnMinWidth = "6rem"
  export let columnMaxWidth
  export let columnFixedWidth

  export let headerFontSize, headerColor, headerBgColor, headerAlign;
  export let dividers, dividersColor;

  export let rowVerticalAlign,
    rowHorizontalAlign,
    rowFontSize,
    rowColorTemplate,
    rowBGColorTemplate;

  export let footerAlign, footerFontSize, footerColorTemplate, footerBGColorTemplate;

  
  export let customCellPadding
  export let customBaseFont
  export let customRowHeight
  export let useOptionColors = true
  export let optionsViewMode = "pills"
  export let relViewMode = "pills"
  export let zebraColors = false
  export let highlighters 

  // Events
  export let onRowSelect;
  export let onCellChange;
  export let onRowClick;
  export let onRowDblClick;
</script>

<div use:styleable={$component.styles}>
  <SuperTable {...$$props}>
    <slot />
  </SuperTable>
</div>