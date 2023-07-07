import { generateScanParams } from "simple-dynamo-utils";

const table = 'table_name'

const filters = [
    {
        attribute: 'property1',
        value: 'val1',
        condition: 'beginsWith'
    },
    {
        attribute: 'property2',
        value: { S:'val2' },
        condition: 'contains',
        comparator: 'or'
    }
]

const projection= ['attr1', 'attr2', 'attr3']

const start_key = { 
    'partition_attribute': 'partition_value', 
    'sort_attribute': 'sort_value' 
}

const params = generateScanParams({
    table: table,
    filters: filters,
    projection: projection,
    startKey: start_key,
    limit: 10
})

console.log(params);

//Expected Output
// {
//     TableName: 'table_name',
//     ExpressionAttributeValues: { ':v0': 'val1', ':v1': { S: 'val2' } },
//     ExpressionAttributeNames: {
//       '#P0': 'attr1',
//       '#P1': 'attr2',
//       '#P2': 'attr3',
//       '#F0': 'property1',
//       '#F1': 'property2'
//     },
//     FilterExpression: 'begins_with ( #F0, :v0 ) OR contains (#F1, :v1)',
//     ProjectionExpression: '#P0, #P1, #P2',
//     ExclusiveStartKey: {
//       partition_attribute: 'partition_value',
//       sort_attribute: 'sort_value'
//     },
//     Limit: 10
// }