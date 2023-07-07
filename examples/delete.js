import { generateDeleteParams } from "simple-dynamo-utils";

const table = 'table_name'

const partition = {
    attribute: 'partition_key',
    value: 'p_val'
}

const sort = {
    attribute: 'sort_key',
    value: 's_val'
}

const params = generateDeleteParams({
    table: table,
    partition: partition,
    sort: sort,
    returnItem: true
})

console.log(params);
//Expected Output
// {
//     TableName: 'table_name',
//     Key: { partition_key: 'p_val', sort_key: 's_val' },
//     ReturnValues: 'ALL_OLD'
// }