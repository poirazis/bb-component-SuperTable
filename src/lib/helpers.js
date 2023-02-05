export const findComponentById = (component, componentId) => {
    if (!component || !componentId) {
      return null
    }
    if (component._id === componentId) {
      return component
    }
    if (!component._children?.length) {
      return null
    }
    for (let child of component._children) {
      const result = findComponentById(child, componentId)
      if (result) {
        return result
      }
    }
    return null
  }