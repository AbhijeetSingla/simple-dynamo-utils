/**
 * @typedef {('and'|'or'|'not')} Comparator
 * @typedef {('equal' | 'lessThan' | 'lessThanEqual' | 'greaterThan' | 'greaterThanEqual' | 'between' | 'beginsWith' | 'startsWith')} SortConditions
 * @typedef {('equal' | 'notEqual' | 'lessThan' | 'lessThanEqual' | 'greaterThan' | 'greaterThanEqual' | 'between' | 'beginsWith' | 'startsWith' | 'contains' | 'listAppend' | 'exists' | 'notExists' | 'type' | 'size')} FilterCondition
 * @typedef {{ attribute: string, value: DynamoDB.AttributeValue, rangeValue: DynamoDB.AttributeValue, condition: FilterCondition, comparator: Comparator }} Filter
 * @typedef {{ table: string, items: Record<string, DynamoDB.AttributeValue>[], projection: string }} BatchGetData
 * @typedef {{ table: string, putItems: Record<string, DynamoDB.AttributeValue>[], deleteItems: Record<string, DynamoDB.AttributeValue>[] }} BatchWriteData
 */

/**
 * @typedef { Object } ScanCommandInputParameters
 * @property { string } table - The name of the dynamodb table.
 * @property {Filter[]?} filters - The filters to apply after scan.
 * @property {string[]?} projection - Attributes to return from the table.
 * @property {Record<string, DynamoDB.AttributeValue | any>?} startKey - The start key for scan.
 * @property {number?} limit - The number of items to scan.
 * @property {number?} segment - The number of segment of scan operation (required with totalSegments).
 * @property {number?} totalSegments - The number of total segments in operation of parallel scan.
 */

/**
 * @typedef { Object } QueryCommandInputParameters
 * @property {string} table - The name of the dynamodb table.
 * @property {{ attribute: string, value: DynamoDB.AttributeValue }} partition - The partition key details.
 * @property {{ attribute: string, value: DynamoDB.AttributeValue, condition: SortConditions }?} sort - The sort key details.
 * @property {Filter[]?} filters - The filters to apply after query.
 * @property {Record<string, DynamoDB.AttributeValue>?} startKey - The index name to query.
 * @property {string?} indexName - The index name to query.
 * @property {string[]?} projection - Attributes to return after the query command.
 * @property {number?} limit - The number of items to query.
 */

