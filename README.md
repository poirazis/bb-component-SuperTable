# BB-Component-SuperTable

A fully customizable, high-performance table component designed specifically for Budibase applications, providing advanced features like virtual scrolling, inline editing, filtering, sorting, and extensive customization options.

## Key Features

### Core Functionality

- **Virtual Scrolling**: Efficiently handles large datasets (10k+ rows) without performance degradation
- **Inline Editing**: Edit cell values directly in the table with schema-driven validation
- **Flexible Data Binding**: Connects to any Budibase datasource (tables, views, external APIs)
- **Advanced Filtering**: Multiple filter operators based on data type (fuzzy search, range, etc.)
- **Sorting**: Ascending/decending sort on any column
- **Pagination**: Cursor-based or limit/offset pagination with fetch-on-scroll
- **Auto-refresh**: Scheduled data refresh from 5 seconds to 60 seconds

### Table Management

- **CRUD Operations**: Create, read, update, and delete rows with configurable permissions
- **Row Selection**: Single or multi-selection with customizable limits and actions
- **Row Actions**: Button actions and context menus per row
- **Bulk Operations**: Execute actions on selected rows (delete, update, etc.)
- **Insert Mode**: Add new rows directly in the table interface

### Customization Options

- **Column Management**: Flexible column sizing (fixed or responsive), resizing, pinning first column
- **Visual Styling**: Configurable sizes (S/M/L), zebra striping, custom colors via templates
- **Dynamic Row Properties**: Conditional row coloring, height, and disabled states
- **Theming**: Quiet mode, highlighters (horizontal/vertical/both), dividers
- **Data Display**: Beautified labels, relationship display modes (pills/links/text), option formatting

### Developer Integration

- **Event System**: Comprehensive events (onRowClick, onCellChange, onInsert, onDelete, etc.)
- **Context Exposure**: Rich context data (current row, selected rows, schema, pagination info)
- **Actions Integration**: Standard Budibase actions (Refresh Datasource, Clear Row Selection, etc.)
- **Performance Optimized**: Reactive updates using Svelte stores and memoization

## Usage Instructions

### Basic Setup

1. Add a Data Provider component to your screen
2. Nest the Super Table component and connect it to your Data Provider
3. Nest Super Column components for each column you want to display
4. Configure table settings through the component panel

### Configuration Sections

#### Data Settings

- **Data Source**: Select your Budibase table, view, or external datasource
- **Columns**: Define which columns to display (auto-populated and customizable)
- **Sort**: Set default sort column and direction
- **Filter**: Apply initial filters to limit displayed data
- **Limit**: Initial number of rows to load
- **Fetch on Scroll**: Enable progressive data loading
- **Auto Refresh**: Schedule automatic data refreshes

#### Table Settings

- **Row Operations**: Enable/disable insert, edit, delete, and select capabilities
- **Filtering**: Simple or advanced filtering modes
- **Row Actions**: Configure button actions and context menus
- **Numbering**: Show row numbering column

#### Column Settings

- **Labels**: Beautify column names and use custom templates
- **Super Columns**: Add custom columns alongside data columns
- **Headers/Footers**: Show/hide and customize column headers and footers
- **Resize**: Allow manual column resizing
- **Pin**: Stick first column for horizontal scrolling scenarios

#### Row Settings

- **Actions**: Button configurations and context menu items
- **Selection**: Configure selection behavior and limits

#### Appearance Settings

- **Size**: Component scale (Small/Medium/Large)
- **Theming**: Quiet mode, zebra colors, highlighters
- **Data Display**: Relationship and option visualization modes
- **Flexibility**: Container responsiveness (shrink/grow)

#### Advanced Styling

- **Dynamic Row Properties**: Template-based coloring, sizing, and disable states
- **Dividers**: Horizontal/vertical divider styles and colors
- **Column Sizing**: Fixed or flexible sizing with min/max constraints

### Events & Actions

The Super Table supports extensive event configuration:

- Row Click / Double Click
- Cell Click / Change
- Insert / Delete operations
- Selection changes
- Link clicks (in relationship columns)

All events provide relevant context data (row, selected rows, schema, etc.) for action binding.

### Example: Custom Row Styling

```js
// Row Background Color Template
{{
  row.Status === 'Active'
    ? 'var(--spectrum-global-color-green-400)'
    : 'var(--spectrum-global-color-gray-200)'
}}

// Row Height Template (numeric value in pixels)
{{ row.Priority === 'High' ? 48 : 36 }}

You can also bind to parent context variables by including `{{variableName}}` in your template strings. Templates also support data processing (formatting dates, numbers, etc.). Each template supports JavaScript expressions and functions based on the context.
```

### Context Variables

The Super Table provides rich context for binding:

- `row`: Current row data
- `rows`: Full dataset array
- `selectedRows`: Array of selected row data
- `selectedIds`: Array of selected row IDs
- `schema`: Table schema definition
- `rowsLength`: Total row count
- `pageNumber`: Current page
- `entitySingular` / `entityPlural`: Display names

## Related Components

### SuperTableColumn

Custom column component for advanced column-specific styling and behavior. Use alongside SuperTable for:

- Column-specific templates
- Advanced filtering options
- Custom cell components
- Column-level actions

### SuperTableCells

Specialized cell components for complex data types and custom rendering.

## Performance Notes

- Virtual scrolling handles unlimited rows efficiently
- Data updates are reactive and debounced
- Filtering/sorting operations are processed client-side when possible
- Large datasets are paginated server-side

## Dependencies

Requires Budibase SDK and the @poirazis/supercomponents-shared package.

Find out more about developing [Custom Plugins](https://docs.budibase.com/docs/custom-plugin) and [Budibase](https://github.com/Budibase/budibase).
