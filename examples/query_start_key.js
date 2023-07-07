import { generateQueryParams } from "simple-dynamo-utils";

const table = 'table_name'

const partition = {
    attribute: 'partition_key',
    value: 'p_val'
}

const sort_query = {
    attribute: 'sort_key',
    value: 's_val',
    condition: 'beginsWith'
}

const filters = [
    {
        attribute: 'property1',
        value: 'val1',
        condition: 'beginsWith'
    },
    {
        attribute: 'property2',
        value: {S:'val2'},
        condition: 'contains',
        comparator: 'or'
    }
]

const projection= ['attr1', 'attr2', 'attr3']

const start_key = { 
    'partition_attribute': 'partition_value', 
    'sort_attribute': 'sort_value' 
}

const params = generateQueryParams({
    table: table,
    partition: partition,
    sort: sort_query,
    filters: filters,
    indexName: 'GLOBAL-INDEX',
    projection: projection,
    startKey: start_key
})

console.log(params);
//Expected Output
// {
//     TableName: 'table_name',
//     KeyConditionExpression: '#KP = :valP AND begins_with ( #KS, :valS )',
//     ExpressionAttributeNames: {
//       '#KP': 'partition_key',
//       '#KS': 'sort_key',
//       '#F0': 'property1',
//       '#F1': 'property2',
//       '#P0': 'attr1',
//       '#P1': 'attr2',
//       '#P2': 'attr3'
//     },
//     ExpressionAttributeValues: {
//       ':valP': 'p_val',
//       ':valS': 's_val',
//       ':v0': 'val1',
//       ':v1': { S: 'val2' }
//     },
//     FilterExpression: 'begins_with ( #F0, :v0 ) OR contains (#F1, :v1)',
//     ProjectionExpression: '#P0, #P1, #P2',
//     ExclusiveStartKey: {
//       partition_attribute: 'partition_value',
//       sort_attribute: 'sort_value'
//     },
//     IndexName: 'GLOBAL-INDEX'
// }