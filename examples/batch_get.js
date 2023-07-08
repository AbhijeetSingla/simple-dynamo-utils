import { createBatchGetParams } from "simple-dynamo-utils"

const batchData = [
    {
        table: 'table_1',
        items: [
            { 'PK': 'part1' },
            { 'PK': 'part2' },
            { 'PK': 'part3' },
            { 'PK': 'part4' }
        ]
    },
    {
        table: 'table_2',
        items: [
            { 'PK': 'part1' },
            { 'PK': 'part2' },
            { 'PK': 'part3' },
            { 'PK': 'part4' }
        ],
        projection: ['attr1', 'attr2', 'attr3']
    },
    {
        table: 'table_3',
        items: [
            { 'PK': 'part1', 'SK': 'sort1' },
            { 'PK': 'part2', 'SK': 'sort2' },
            { 'PK': 'part3', 'SK': 'sort3' },
            { 'PK': 'part4', 'SK': 'sort4' },
        ]
    }
]

const params = createBatchGetParams(batchData)

console.log(params)
//Expected Output
// {
//     RequestItems: {
//         table_1: {
//             Keys: [
//                 { PK: 'part1' },
//                 { PK: 'part2' },
//                 { PK: 'part3' },
//                 { PK: 'part4' }
//             ]
//         },
//         table_2: {
//             Keys: [
//                 { PK: 'part1' },
//                 { PK: 'part2' },
//                 { PK: 'part3' },
//                 { PK: 'part4' }
//             ],
//             Projection: '#P0, #P1, #P2',
//             ExpressionAttributeNames: { '#P0': 'attr1', '#P1': 'attr2', '#P2': 'attr3' }
//         },
//         table_3: {
//             Keys: [
//                 { PK: 'part1', SK: 'sort1' },
//                 { PK: 'part2', SK: 'sort2' },
//                 { PK: 'part3', SK: 'sort3' },
//                 { PK: 'part4', SK: 'sort4' }
//               ]
//         }
//     }
// }