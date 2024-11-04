export const verify = (schema) => {
  return (data) => {
    const result = {}
    const { body, require } = schema
    // Verify the required fields to be filled in
    if (require) {
      require.forEach((key) => {
        if (data[key] === undefined) {
          throw new Error(`Parameter ${key} must be filled in.`)
        }
      })
    }

    for (const key in body) {
      const value = data[key]
      const { type, length, RegExp } = body[key]

      // Format Validation
      const typeCase = type.name.toLowerCase()
      if (value !== undefined && typeof value !== typeCase) {
        throw new Error(`Invalid type for "${key}". Expected "${typeCase}", not "${typeof value}".`)
      }
      // Regular operation
      if (RegExp && !RegExp.test(value)) {
        throw new Error(`"${key}" does not conform to the format.`)
      }
      // Parameter length
      if (length && typeof value === String) {
        let len = value.length
        if (length[0] === length[1] && len !== length[0])
          throw new Error(`Invalid type for "${key}". The parameter length should be equal "${length[0]}".`)

        if (len < length[0] || len > length[1])
          throw new Error(`Invalid type for "${key}". The parameter length should be between "${length[0]}" and "${length[1]}".`)
      }

      // Default value
      if (body[key].default) {
        value !== undefined ? result[key] = value : result[key] = body[key].default
      } else {
        result[key] = value
      }
    }
    return result
  }
}