function parseCondition({name, value, condition, rangeValue}){
    if(condition === 'equal')return `${name} = ${value}`
    if(condition === 'notEqual') return [name, '<>', value].join(' ')
    if(condition === 'lessThan')return `${name} < ${value}`
    if(condition === 'lessThanEqual')return `${name} <= ${value}`
    if(condition === 'greaterThan')return `${name} > ${value}`
    if(condition === 'greaterThanEqual')return `${name} >= ${value}`
    if(condition === 'between')return `${name} BETWEEN ${value} AND ${rangeValue}`
    if(condition === 'beginsWith')return `begins_with ( ${name}, ${value} )`
    if(condition === 'startsWith')return `begins_with ( ${name}, ${value} )`
    if(condition === 'contains') return `contains (${name}, ${value})`
    if(condition === 'listAppend') return `list_append (${name}, ${value})`
    if(condition === 'exists') return `attribute_exists (${name})`
    if(condition === 'notExists') return `attribute_not_exists (${name})`
    if(condition === 'type') return `attribute_type (${name}, ${value})`
    if(condition === 'size') return `begins_with (${name}, ${value})`
    return ''
}

function parseOperator(comparator = ''){
    if(comparator === 'and') return 'AND'
    if(comparator === 'or') return 'OR'
    if(comparator === 'not') return 'NOT'
    return 'AND'
}
export {
    parseOperator,
    parseCondition
}