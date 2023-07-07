import { generateScanParams } from "simple-dynamo-utils";

const table = 'table_name'

const workers = 3

const params = [...Array(workers).keys()].map((segment) => {
    return generateScanParams({
        table: table,
        segment: segment,
        totalSegments: workers
    })
})

console.log(params);
//Expected Output
// [
//     { TableName: 'table_name', Segment: 0, TotalSegments: 3 },
//     { TableName: 'table_name', Segment: 1, TotalSegments: 3 },
//     { TableName: 'table_name', Segment: 2, TotalSegments: 3 }
// ]

//multiple params can be used to parallel scan table, each element of the array can be set in a scan table function and ran in parallel, this can reduce scan time