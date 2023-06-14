function convertToJs(dataObject) {
    for (const [type, value] of Object.entries(dataObject)) {
        if (value !== undefined) {
            switch (type) {
                case "NULL":
                    return null;
                case "BOOL":
                    return Boolean(value);
                case "N":
                    return Number(value);
                case "B":
                    return value;
                case "S":
                    return String(value);
                case "L":
                    return convertToArray(value);
                case "M":
                    return convertToObject(value);
                case "NS":
                    return new Set(value.map((item) => Number(item)));
                case "BS":
                    return new Set(value);
                case "SS":
                    return new Set(value.map(element => String(element)));
                default:
                    throw Error(`invalid type: ${type}`);
            }
        }
    }
    throw new Error(`No value defined: ${JSON.stringify(dataObject)}`);
}

function convertToArray(value){
    if(typeof value === 'string') return JSON.parse(value).map(element => convertToJs(element))
    return value.map(element => convertToJs(element))
}

function convertToObject(value){
    if(typeof value === 'string') return iterate(JSON.parse(value))
    return iterate(value)
}

function iterate(map){
    for (const key in map) {
        map[key] = convertToJs(map[key])
    }
    return map
}

export {
    convertToJs,
    iterate
}