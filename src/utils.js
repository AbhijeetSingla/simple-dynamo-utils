function parseCondition({attribute, value, condition, rangeValue}){
    if(condition === 'equal')return `${attribute} = ${value}`
    if(condition === 'notEqual') return [attribute, '<>', value].join(' ')
    if(condition === 'lessThan')return `${attribute} < ${value}`
    if(condition === 'lessThanEqual')return `${attribute} <= ${value}`
    if(condition === 'greaterThan')return `${attribute} > ${value}`
    if(condition === 'greaterThanEqual')return `${attribute} >= ${value}`
    if(condition === 'between')return `${attribute} BETWEEN ${value} AND ${rangeValue}`
    if(condition === 'beginsWith')return `begins_with ( ${attribute}, ${value} )`
    if(condition === 'startsWith')return `begins_with ( ${attribute}, ${value} )`
    if(condition === 'contains') return `contains (${attribute}, ${value})`
    if(condition === 'listAppend') return `list_append (${attribute}, ${value})`
    if(condition === 'exists') return `attribute_exists (${attribute})`
    if(condition === 'notExists') return `attribute_not_exists (${attribute})`
    if(condition === 'type') return `attribute_type (${attribute}, ${value})`
    if(condition === 'size') return `begins_with (${attribute}, ${value})`
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