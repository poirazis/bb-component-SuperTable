import { get, writable } from "svelte/store";

// The state store holds UI/UX related synch changes to avoid unecessary refreshes of the main data store
// It acts as the single source of truth for all super columns to adjust accordingly
export const createSuperTableStateStore = () => {
	const { set, update, subscribe } = writable({
		controllerID: null,
		columnRowHeights: [],
		rowHeights: [],
		minRowHeight: 18,
		fixedRowHeight: true,
		hoveredRow: null,
		hoveredColumn: null,
		crossHairsOn: false,
		loaded: false,
		rowClicked: null,
		holdLastRowClicked: false,
		scrollY: 0,
		scrollX: 0,
		size: "M"
	})

	return {
		set,
		subscribe,
		setRowMinHeight ( rowMin ) {
			update ( state => {
				state.minRowHeight = rowMin
				state.rowHeights = new Array(100).fill(rowMin)
				return state
			})
		},
		hoverRow ( columnID, rowIndex ) {
			update ( state => {
				state.hoveredRow = rowIndex
				if ( state.crossHairsOn )
					state.hoveredColumn = columnID
				return state
			})
		},
		unhoverRow ()  {
			update ( state => {
				state.hoveredRow = null
				state.hoveredColumn = null 
				return state
			})
		},
		resizeRow ( columnID, rowIndex, height ) {
			update( state => {
				let index = state.columnRowHeights.findIndex(v => v.columnID === columnID)
				if ( index > -1 ) {
					state.columnRowHeights[index].rowHeights[rowIndex] = height
				} else {
					let newRowHeights=[]
					newRowHeights[rowIndex] = height
					state.columnRowHeights.push({ columnID: columnID, rowHeights: newRowHeights })
				}

				state.rowHeights[rowIndex] = Math.max (...state.columnRowHeights.map(t => t.rowHeights[rowIndex]))
				return state
			})
		},
		synchScrollY ( offset ) {
			update ( state => {
				state.scrollY = offset
				return state
			} )
		},
		removeRowHeights ( columnID ) {
			update(state => {
				let index = state.columnRowHeights.findIndex( v => v.columnID === columnID )
				if (index > -1)  {
					state.columnRowHeights.splice(index, 1)
					if ( state.columnRowHeights.length > 0 ){ 
						for (let idx = 0; idx < state.rowHeights.length; idx++) {
							state.rowHeights[idx] = Math.max (...state.columnRowHeights.map(t => t.rowHeights[idx]))
						}
					} else {
						state.rowHeights = new Array(100).fill(state.minRowHeight)
					}
				}
				return state
			})
		}
	}
}

// The FilterStore will hold all filter definitions as requested by each Super Column
// so the can be centrally applied to the dataProvider by the Super Table
export const createSuperTableFilterStore = () => {
	const { set, update, subscribe } = writable({
		filters: [],
		showFilters: false
	})

	return {
		subscribe,
		setFilter(filter) {
			update(state => {
				let indx = state.filters.findIndex(v => v.id === filter.id)
				if (indx > -1) {
					state.filters[indx] = filter
				} else {
					state.filters = [...state.filters, filter]
				}
				return state;
			});
		},
		clearFilter(filter) {
			console.log("Clear!")
			update(state => {
				let indx = state.filters.findIndex(v => v.id === filter.id)
				state.filters.splice(indx, indx >= 0 ? 1 : 0);
				return state;
			})
		}
	}
}

// The main store holds the data related and Super Table Columns registration and data synchronization
export const createSuperTableDataStore = () => {
	const { set, update, subscribe } = writable({
		_parentID: undefined,
		dataSource: {},
		schema: {},
		data: [],
		loaded: false,
		dataChanges: [],
		idColumn: null,
		registeredColumns: [],
		selectedRows: [],
		filters: [],
		isFiltered: false,
		sortColumn: undefined,
		sortDirection: undefined
	});

	return {
		set,
		update,
		subscribe,
		nextUnusedField() {
			let state = get(this)
			let allFields = Object.keys(state.schema ?? {})
			let usedFields = state.registeredColumns.map(v => v.field)
			let freeField = allFields.filter(v => !usedFields.includes(v))
			return freeField[0] ?? ""
		},

		lastUsedField() {
			let state = get(this)
			let usedFields = state.registeredColumns.map(v => v.field)
			return usedFields[usedFields.length - 1]
		},

		registerColumn(column) {
			update(state => ({ ...state, registeredColumns: [...state.registeredColumns, column] }))
		},

		unregisterColumn(column) {
			update(state => {
				let index = state.registeredColumns.findIndex(v => v.id === column.id);
				state.registeredColumns.splice(index, index >= 0 ? 1 : 0);
				return state;
			});
		},

		updateColumn(column) {
			if (column.id && column.field) {
				update(state => {
					let index = state.registeredColumns.findIndex(v => v.id === column.id)
					if (index > -1) state.registeredColumns[index] = column
					return state
				});
			}
		},
		logDataChange(rowKey, field, originalValue, newValue) {
			let newChange = {
				rowKey: rowKey,
				field: field,
				originalValue: originalValue,
				newValue: newValue
			}
			update(state => ({ ...state, dataChanges: [...state.dataChanges, newChange] }))
		}
	};
};