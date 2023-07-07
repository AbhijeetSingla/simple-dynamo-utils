import { generatePutParams } from "simple-dynamo-utils";

const table = 'table_name'

const item = {
    'partition_key': 'p_val',
    'sort_key': 's_val',
    'attr1': 'val1',
    'attr2': 'val2',
    'attr3': 'val3',
    'attr4': 'val4',
}

const params = generatePutParams({
    table: table,
    item: item,
    returnOldItem: true
})

console.log(params);
//Expected Output
// {
//     TableName: 'table_name',
//     Item: {
//       partition_key: 'p_val',
//       sort_key: 's_val',
//       attr1: 'val1',
//       attr2: 'val2',
//       attr3: 'val3',
//       attr4: 'val4'
//     },
//     ReturnValues: 'ALL_OLD'
// }