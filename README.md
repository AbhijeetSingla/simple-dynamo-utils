# simple-dynamo-utils
This library includes simplified AWS DynamoDb functions.
> [!CAUTION]
> This library is still a WIP
> Newer version can bring breaking changes

# Install
Just install the module with npm

`npm install simple-dynamo-utils`

# Example

> **Full Documentation can be found in the repository**

## update function parameters
<pre>
import { generateUpdateParams } from 'simple-dynamo-utils'

const item_attributes = {
    'property1': 'value1',
    'property2': 'value2',
    'property3': 'value3'
}

const table = 'table_name'

const params = generateUpdateParams({
    table: table,
    partition: {
        name: 'partition_name',
        value: 'p_val'
    },
    sort: {
        name: 'sort_name',
        value: 's_val'
    },
    attributes: item_attributes,
    returnItems: 'ALL_NEW'
})

console.log(params);
</pre>

### output
<pre>
{
  TableName: 'table_name',
  Key: { partition_name: 'p_val', sort_name: 's_val' },
  ExpressionAttributeNames: { '#U0': 'property1', '#U1': 'property2', '#U2': 'property3' },
  ExpressionAttributeValues: { ':val0': 'value1', ':val1': 'value2', ':val2': 'value3' },
  UpdateExpression: 'SET #U0 = :val0, #U1 = :val1, #U2 = :val2',
  ReturnValues: 'ALL_NEW'
}
</pre>
# Functions
- Generate Parameters:
    - Put: with old item return in case of over write
    - Get: with projection (returned attributes)
    - Query: with support for:
        - filters
        - start key
        - index name
        - projection (returned attributes)
        - limit (amount of items to query)
    - Scan: with support for:
        - filters
        - start key
        - projection (returned attributes)
        - limit (amount of items to scan)
        - parallel scan properties
    - Update: with support for:
        - custom update expression over write
        - return items new or old, updated or all
    - Delete: with old item return