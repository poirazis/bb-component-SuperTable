<script>
  import { getContext } from "svelte";
  import SuperTable from "../../bb_super_components_shared/src/lib/SuperTable/SuperTable.svelte";

  const { styleable, builderStore } = getContext("sdk");
  const component = getContext("component");

  export let datasource;
  export let isTable;

  export let idColumn = "_id";
  export let sortColumn;
  export let sortOrder;
  export let limit;
  export let fetchOnScroll;
  export let fetchPageSize;
  export let autoRefresh;
  export let autoRefreshRate;
  export let paginate;
  export let filter;
  export let columnList = [];
  export let autocolumns;
  export let jsoncolumns;

  export let visibleRowCount = 10;
  export let showFooter;
  export let showHeader;
  export let size;
  export let canInsert, canDelete, canEdit, canSort, canResize, canFilter;
  export let deleteIconPosition = "left";
  export let showFilterOperators;
  export let superColumnsPos;

  export let debounce = 750;

  export let rowSelectMode;
  export let rowMenu = false;
  export let rowMenuItems;
  export let selectionMenu = false;
  export let selectionMenuItems;
  export let menuItemsVisible;
  export let preselectedId;
  export let preselectedIds;
  export let selectionColumn;
  export let selectionLimit;
  export let numberingColumn = true;
  export let stickFirstColumn = false;

  export let columnSizing = "flex";
  export let columnMinWidth = "6rem";
  export let columnMaxWidth = "auto";
  export let columnFixedWidth = "8rem";

  export let headerFontSize, headerColor, headerBgColor, headerAlign;
  export let dividers, dividersColor;

  export let rowVerticalAlign,
    rowHorizontalAlign,
    rowFontSize,
    rowColorTemplate,
    rowBGColorTemplate;

  export let footerAlign,
    footerFontSize,
    footerColorTemplate,
    footerBGColorTemplate;

  export let customCellPadding;
  export let customBaseFont;
  export let customRowHeight;
  export let useOptionColors = true;
  export let optionsViewMode = "pills";
  export let relViewMode = "pills";
  export let zebraColors = false;
  export let quiet;
  export let highlighters;

  // Events
  export let onRowSelect;
  export let onCellChange;
  export let onRowClick;
  export let onRowDblClick;
  export let onInsert;
  export let onDelete;
  export let onEdit;

  // Builder Code to identify if we are dealing with a Table or View Datasource
  $: localIsTable = datasource?.type == "table" || datasource?.tableId;
  $: if (
    $builderStore.inBuilder &&
    $component.selected &&
    isTable != localIsTable
  ) {
    builderStore.actions.updateProp("isTable", localIsTable);
  }

  $: $component.styles = {
    ...$component.styles,
    normal: {
      width: "100%",
      overflow: "hidden",
    },
  };
</script>

<div use:styleable={$component.styles}>
  <SuperTable
    {datasource}
    {idColumn}
    {sortColumn}
    {sortOrder}
    {limit}
    {fetchOnScroll}
    {fetchPageSize}
    {autoRefresh}
    {autoRefreshRate}
    {paginate}
    {filter}
    {columnList}
    {autocolumns}
    {jsoncolumns}
    {visibleRowCount}
    {showFooter}
    {showHeader}
    {size}
    {canInsert}
    {canDelete}
    {deleteIconPosition}
    {canEdit}
    {canSort}
    {canResize}
    {canFilter}
    {showFilterOperators}
    {superColumnsPos}
    {debounce}
    {rowSelectMode}
    {rowMenu}
    {rowMenuItems}
    {menuItemsVisible}
    {selectionMenu}
    {selectionMenuItems}
    {preselectedId}
    {preselectedIds}
    {selectionColumn}
    {selectionLimit}
    {columnSizing}
    {columnMinWidth}
    {columnMaxWidth}
    {columnFixedWidth}
    {headerFontSize}
    {headerColor}
    {headerBgColor}
    {headerAlign}
    {dividers}
    {dividersColor}
    {rowVerticalAlign}
    {rowHorizontalAlign}
    {rowFontSize}
    {rowColorTemplate}
    {rowBGColorTemplate}
    {footerAlign}
    {footerFontSize}
    {footerColorTemplate}
    {footerBGColorTemplate}
    {customCellPadding}
    {customBaseFont}
    {customRowHeight}
    {useOptionColors}
    {optionsViewMode}
    {relViewMode}
    {zebraColors}
    {quiet}
    {highlighters}
    {onRowSelect}
    {onCellChange}
    {onRowClick}
    {onRowDblClick}
    {onInsert}
    {onDelete}
    {onEdit}
    {numberingColumn}
    {stickFirstColumn}
  >
    <slot />
  </SuperTable>
</div>
