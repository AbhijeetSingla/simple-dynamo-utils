import { createBatchWriteParams } from 'simple-dynamo-utils'

const itemAttributes = {
    'attr1': 'val1',
    'attr2': 'val2',
    'attr3': 'val3',
    'attr4': 'val4',
}

const batchData = [
    {
        table: 'table_1',
        putItems: [
            { 'PK': 'part1', ...itemAttributes },
            { 'PK': 'part2', ...itemAttributes },
            { 'PK': 'part3', ...itemAttributes },
            { 'PK': 'part4', ...itemAttributes }
        ]
    },
    {
        table: 'table_2',
        deleteItems: [
            { 'PK': 'part1'},
            { 'PK': 'part2'},
            { 'PK': 'part3'},
            { 'PK': 'part4'}
        ]
    },
    {
        table: 'table_3',
        putItems: [
            { 'PK': 'part1', 'SK': 'sort1', ...itemAttributes },
            { 'PK': 'part2', 'SK': 'sort2', ...itemAttributes },
            { 'PK': 'part3', 'SK': 'sort3', ...itemAttributes },
            { 'PK': 'part4', 'SK': 'sort4', ...itemAttributes },
        ],
        deleteItems: [
            { 'PK': 'part1', 'SK': 'sort1' },
            { 'PK': 'part2', 'SK': 'sort2' },
            { 'PK': 'part3', 'SK': 'sort3' },
            { 'PK': 'part4', 'SK': 'sort4' },
        ]
    }
]

const params = createBatchWriteParams(batchData)

console.log(params);
//Expected Output
// {
//     RequestItems: {
//         table_1: [
//             { PutRequest: { Item: { 'PK': 'part1', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } },
//             { PutRequest: { Item: { 'PK': 'part2', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } },
//             { PutRequest: { Item: { 'PK': 'part3', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } },
//             { PutRequest: { Item: { 'PK': 'part4', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } }
//         ],
//         table_2: [
//             { DeleteRequest: { Item: { 'PK': 'part1' } } },
//             { DeleteRequest: { Item: { 'PK': 'part2' } } },
//             { DeleteRequest: { Item: { 'PK': 'part3' } } },
//             { DeleteRequest: { Item: { 'PK': 'part4' } } }
//         ],
//         table_3: [
//             { PutRequest: { Item: { 'PK': 'part1', 'SK': 'sort1', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } },
//             { PutRequest: { Item: { 'PK': 'part2', 'SK': 'sort2', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } },
//             { PutRequest: { Item: { 'PK': 'part3', 'SK': 'sort3', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } },
//             { PutRequest: { Item: { 'PK': 'part4', 'SK': 'sort4', 'attr1': 'val1', 'attr2': 'val2', 'attr3': 'val3', 'attr4': 'val4' } } },
//             { DeleteRequest: { Key: { 'PK': 'part1', 'SK': 'sort1' } } },
//             { DeleteRequest: { Key: { 'PK': 'part2', 'SK': 'sort2' } } },
//             { DeleteRequest: { Key: { 'PK': 'part3', 'SK': 'sort3' } } },
//             { DeleteRequest: { Key: { 'PK': 'part4', 'SK': 'sort4' } } }
//         ]
//     }
// }