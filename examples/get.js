import { generateGetParams } from "simple-dynamo-utils";

const table = 'table_name'

const partition = {
    attribute: 'partition_key',
    value: 'p_val'
}

const sort = {
    attribute: 'sort_key',
    value: 's_val'
}

const params = generateGetParams({
    table: table,
    partition: partition,
    sort: sort,
    projection: ['attr1', 'attr2', 'attr3']
})

console.log(params);

//Expected Output:
//  {
//     TableName: 'table_name',
//     Key: { partition_key: 'p_val', sort_key: 's_val' },
//     ExpressionAttributeNames: { '#P0': 'attr1', '#P1': 'attr2', '#P2': 'attr3' },
//     ProjectionExpression: '#P0, #P1, #P2'
//  }