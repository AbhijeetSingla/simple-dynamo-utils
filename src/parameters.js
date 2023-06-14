import { parseCondition, parseOperator } from './utils.js'

// //TODO: function generateExpressionNames(any object and values or array ) result is ['#f1', 'prop name']
// //TODO: scan and query params pagination

/**
 * @typedef {('and'|'or'|'not')} Comparator
 * @typedef {('equal' | 'lessThan' | 'lessThanEqual' | 'greaterThan' | 'greaterThanEqual' | 'between' | 'beginsWith' | 'startsWith')} SortConditions
 * @typedef {('equal' | 'notEqual' | 'lessThan' | 'lessThanEqual' | 'greaterThan' | 'greaterThanEqual' | 'between' | 'beginsWith' | 'startsWith' | 'contains' | 'listAppend' | 'exists' | 'notExists' | 'type' | 'size')} FilterCondition
 * @typedef {{ attribute: string, value: DynamoDB.AttributeValue, rangeValue: DynamoDB.AttributeValue, condition: FilterCondition, comparator: Comparator }} Filter
 */

function generateFilters({ filters, names, values }){
    const expression = filters?.map(({ attribute, value, rangeValue, comparator, condition }, index) => {
        
        const attributeHash = (() => {
            if(!Object.values(names).includes(attribute)) {
                names[`#F${index}`] = attribute
                return `#F${index}`
            }
            return Object.keys(names).find(key => names[key] === attribute) || ''
        })()

        if(value) values[`:v${index}`] = value
        if(rangeValue) values[`:rv${index}`] = rangeValue

        const string = (()=> {
            if(condition) return parseCondition({
                name: attributeHash,
                condition,
                ...(value ? {value: `:v${index}`} : {}),
                ...(rangeValue ? {rangeValue: `:rv${index}`} : {}),
            })
            return ''
        })()

        const operator = index || comparator ? parseOperator(comparator) : ''

        return [operator, string].join(' ')
    }).join(' ')

    if(expression.includes('false')) return { }

    return { names, values, expression }
}

function generateProjectionExpression({expressionNames, projection}){
    const p_expression = projection?.map((attribute, index) => {
        if(!Object.values(expressionNames).includes(attribute)) {
            expressionNames[`#F${index}`] = attribute
            return `#F${index}`
        }
        return Object.keys(expressionNames).find(key => expressionNames[key] === attribute) || ''
    }).join(', ')

    return {
        names: expressionNames,
        p_expression: p_expression
    }
}

/**
 * Generate ScanTable expression.
 * @param {Object} scanInput - The details for table to scan.
 * @param {string} scanInput.table - The name of the dynamodb table.
 * @param {Filter[]?} scanInput.filters - The filters to apply after scan.
 * @param {string[]?} scanInput.projection - Attributes to return from the table.
 * @param {Record<string, DynamoDB.AttributeValue>?} scanInput.startKey - The start key for scan.
 * @param {number?} scanInput.limit - The number of items to scan.
 * @param {number?} scanInput.segment - The number of segment of scan operation (required with totalSegments).
 * @param {number?} scanInput.totalSegments - The number of total segments in operation of parallel scan.
 */
function generateScanParams({ table, filters, projection, startKey, limit, segment, totalSegments }){
    //TODO: check if reduce would work better
    if(!filters?.length && !projection?.length) return { 
        TableName: table, 
        ...(startKey ? { ExclusiveStartKey: startKey } : {}),
        ...(limit ? { Limit: limit } : {} ),
        ...(totalSegments ? {Segment: segment, TotalSegments: totalSegments} : {})
    }
    const names = {}
    const p_expression = projection && generateProjectionExpression({
        expressionNames: names,
        projection: projection
    }).p_expression || ''
    if(!filters?.length) return { 
        TableName: table, 
        ExpressionAttributeNames: names, 
        ...(startKey ? { ExclusiveStartKey: startKey } : {}),
        ...(limit ? { Limit: limit } : {} ),
        ...(totalSegments ? {Segment: segment, TotalSegments: totalSegments} : {})
    }
    const values = {}

    const { expression } = generateFilters({ filters, names, values })
    
    return {
        TableName: table,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names,
        ...(expression ? {FilterExpression: expression.trim()} : {}),
        ...(p_expression ? {ProjectionExpression: p_expression} : {}),
        ...(startKey ? { ExclusiveStartKey: startKey } : {}),
        ...(limit ? { Limit: limit } : {} ),
        ...(totalSegments ? {Segment: segment, TotalSegments: totalSegments} : {})
    }
}

/**
 * Generate QueryItem expression.
 * @param {Object} queryInput - The details for table in which item is.
 * @param {string} queryInput.table - The name of the dynamodb table.
 * @param {{ name: string, value: DynamoDB.AttributeValue }} queryInput.partition - The queryInput's partition key details.
 * @param {{ name: string, value: DynamoDB.AttributeValue, condition: SortConditions }?} queryInput.sort - The queryInput's sort key details.
 * @param {Filter[]?} queryInput.filters - The filters to apply after query.
 * @param {Record<string, DynamoDB.AttributeValue>?} queryInput.startKey - The index name to query.
 * @param {string?} queryInput.indexName - The index name to query.
 * @param {string[]?} queryInput.projection - Attributes to return after the query command.
 * @param {number?} scanInput.limit - The number of items to query.
 */
function generateQueryParams({table, partition, sort, filters, startKey, indexName, projection, limit}){

    const names = {
        '#KP': partition.name,
        ...(sort?.name ? { '#KS': sort.name } : {})
    }, values = {
        ':valP': partition.value,
        ...(sort?.name ? { ':valS': sort.value } : {})
    }

    const sortExpression = sort?.name ?  'AND'.concat(parseCondition({
        name: '#KS',
        value: ':valS',
        condition: sort?.condition
    })) : '';

    const keyExpression = '#KP = :valP' + sortExpression

    const filterExpression = filters ? generateFilters({ filters, names, values }).expression || '' : ''
    
    const projectionExpression = projection?.length ? generateProjectionExpression({
        expressionNames: names,
        projection
    }).p_expression : ''

    return {
        TableName: table,
        KeyConditionExpression: keyExpression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ...(filterExpression ? { FilterExpression: filterExpression.trim() } : {}),
        ...(projectionExpression ? { ProjectionExpression: projectionExpression.trim() } : {}),
        ...(startKey ? { ExclusiveStartKey: startKey } : {}),
        ...(indexName ? { IndexName: indexName } : {}),
        ...(limit ? { Limit: limit } : {})
    }
}


/**
 * Generate update expression and related objects for names and values.
 * @param {Object} updateInput - The details for table in which item is to be updated.
 * @param {string} updateInput.table - The name of the dynamodb table.
 * @param {{ name: string, value: DynamoDB.AttributeValue }} updateInput.partition - The updateInput's partition key details.
 * @param {{ name: string, value: DynamoDB.AttributeValue }?} updateInput.sort - The updateInput's sort key details.
 * @param {Record<string, DynamoDB.AttributeValue} updateInput.attributes - The attributes for the record which need to be updated.
 * @param {string?} updateInput.expression - A custom update expression to overwrite the generated one for better control.
 * @param {('NONE' | 'ALL_NEW' | 'ALL_OLD' | 'UPDATED_NEW' | 'UPDATED_OLD')} updateInput.returnItems - Items to return after the update command.
 */
function generateUpdateParams({table, partition, sort = {}, attributes, expression : customExpression = '', returnItems}) {
    if (!attributes) throw new Error('Invalid Parameters: No Item Object Provided')
    if (!Object.keys(attributes).length) throw new Error('Invalid parameters: no attributes to update')

    const names = {}, values = {}
    //TODO: reduce code
    if(customExpression){
        Object.entries(item).map(([key, val], index) => {
            if(key.includes('.')){
                key.split('.').map((k, index) => names[`#UN${index}`] = k )
            } else {
                names[`#U${index}`] = key
            }
            values[`:val${index}`] = val
        })
        return {
            TableName: table,
            Key: {
                [partition.name]: partition.value,
                ...(Object.keys(sort).length ? { [sort.name]: sort.value } : {})
            },
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values,
            UpdateExpression: customExpression,
        ...(returnItems ? { ReturnValues: returnItems } : {})
        }
    }
    
    const expression = 'SET ' + Object.entries(attributes).map(([property, value], index) => {
        values[`:val${index}`] = value
        names[`#U${index}`] = property
        return parseCondition({
          name: `#U${index}`,
          value: `:val${index}`,
          condition: 'equal'
        })
    }).join(', ')

    return {
        TableName: table,
        Key: {
            [partition.name]: partition.value,
            ...(Object.keys(sort).length? { [sort.name]: sort.value } : {})
        },
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        UpdateExpression: expression,
        ...(returnItems ? { ReturnValues: returnItems } : {})
    }
}

/**
 * Generate GetItem expression.
 * @param {Object} getInput - The details for table in which item is.
 * @param {string} getInput.table - The name of the dynamodb table.
 * @param {{ name: string, value: DynamoDB.AttributeValue }} getInput.partition - The getInput's partition key details.
 * @param {{ name: string, value: DynamoDB.AttributeValue }?} getInput.sort - The getInput's sort key details.
 * @param {string[]?} getInput.projection - Attributes to return after the update command.
 */
function generateGetParams({ table, partition, sort, projection }){
    if (!table) throw new Error('Invalid Parameters: no table name provided')
    if (!partition) throw new Error('Invalid Parameters: no keys object provided')
    if (!Object.keys(partition).length) throw new Error('Invalid parameters: empty keys object')
    const names = {}
    const projectionExpression = projection?.length ? generateProjectionExpression({
        expressionNames: names,
        projection
    }).p_expression : ''
    const projectionObject = projection?.length ? {
        ExpressionAttributeNames: names,
        ProjectionExpression: projectionExpression
    } : {}
    return {
        TableName: table,
        Key: {
            [partition.name]: partition.value,
            ...(sort? { [sort.name]: sort.value } : {})
        },
        ...(projection ? projectionObject : {})
    }
}

/**
 * Generate DeleteItem expression.
 * @param {Object} deleteInput - The details for table in which item is to be deleted.
 * @param {string} deleteInput.table - The name of the dynamodb table.
 * @param {{ name: string, value: DynamoDB.AttributeValue }} deleteInput.partition - The deleteInput's partition key details.
 * @param {{ name: string, value: DynamoDB.AttributeValue }?} deleteInput.sort - The deleteInput's sort key details.
 * @param {boolean?} deleteInput.returnItem - Attributes to return after the delete command.
 * @todo deleteInput.condition - The condition expression to execute this command.
 */
function generateDeleteParams({table, partition, sort, returnItem, condition}){
    return {
        TableName: table,
        Key: {
            [partition.name]: partition.value,
            ...(sort? { [sort.name]: sort.value } : {})
        },
        ...(returnItem ? { ReturnValues: 'ALL_OLD' } : { ReturnValues: 'NONE' })
    }
}

/**
 * Generate PutItem expression and related objects for names and values.
 * @param {Object} putInput - The details for table in which item is to be created.
 * @param {string} putInput.table - The name of the dynamodb table.
 * @param {{ name: string, value: DynamoDB.AttributeValue }} putInput.item - Item attributes.
 * @param {boolean?} putInput.returnOldItem - Items to return if an existing item was overwritten.
 * @todo putInput.condition - The condition expression to execute this command.
 * @todo putInput.exists - The condition to check before attaching conditional operation.
 */
function generatePutParams({ table, item, returnOldItem, condition }){
    return {
        TableName: table,
        Item: item,
        ...(returnOldItem ? { ReturnValues: 'ALL_OLD' } : { ReturnValues: 'NONE' })
    }
}

// function createBatchWriteParams(batchData) {
//     return {
//         RequestItems: {
//             ...Object.fromEntries(batchData.map(({ tableName, itemArray }) => {
//                 return [tableName, itemArray.map(item => {
//                     const { requestType = 'put', ...rest } = item;
//                     const type = (()=> {
//                         if(requestType === 'put') return 'PutRequest'
//                         if(requestType === 'delete') return 'DeleteRequest'
//                         throw Error('Invalid batch request type, it can either be "put" or "delete"')
//                     })()
//                     return {
//                         [type]: {
//                             Item: {
//                                 ...rest
//                             }
//                         }
//                     }
//                 })]
//             }))
//         }
//     }
// }

// function createBatchGetParams(batchGetData) {
//     return {
//         RequestItems: {
//             ...Object.fromEntries(batchGetData.map(({ itemArray, tableName }) => {
//                 return [ tableName,  { Keys: itemArray } ]
//             }))
//         }
//     }
// }

export {
    generateGetParams,
    generateScanParams,
    generateQueryParams,
    generateUpdateParams,
    generatePutParams,
    generateDeleteParams
}