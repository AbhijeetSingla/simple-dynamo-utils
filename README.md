# simple-dynamo-utils
This library includes simplified AWS DynamoDb functions.

# Install
Just install the module with npm

`npm install simple-dynamo-utils`

# Examples

> **Please refer to the examples folder in the repository**

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
