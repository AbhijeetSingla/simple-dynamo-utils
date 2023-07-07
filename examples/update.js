import { generateUpdateParams } from "simple-dynamo-utils";

const table = 'table_name'

const partition = {
    attribute: 'partition_key',
    value: 'p_val'
}

const sort = {
    attribute: 'sort_key',
    value: 's_val'
}

const attributes = {
    'property1': 'value1',
    'property2': 'value2',
    'property3': 'value3'
}

const params = generateUpdateParams({
    table: table,
    partition: partition,
    sort: sort,
    attributes: attributes,
    returnItems: 'UPDATED_OLD'
})

console.log(params);
//Expected Output
// {
//     TableName: 'table_name',
//     Key: { partition_key: 'p_val', sort_key: 's_val' },
//     ExpressionAttributeNames: { '#U0': 'property1', '#U1': 'property2', '#U2': 'property3' },
//     ExpressionAttributeValues: { ':val0': 'value1', ':val1': 'value2', ':val2': 'value3' },
//     UpdateExpression: 'SET #U0 = :val0, #U1 = :val1, #U2 = :val2',
//     ReturnValues: 'UPDATED_OLD'
// }