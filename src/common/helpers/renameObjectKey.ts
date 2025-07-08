export interface KeyMap {
    [key: string]: string;
}

export interface AnyObject {
    [key: string]: any;
}

export function renameKeys<T extends AnyObject>(obj: T, keyMap: KeyMap): AnyObject {
    const newObj: AnyObject = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = keyMap[key] || key;
            newObj[newKey] = obj[key];
        }
    }

    return newObj;
}


export function renameKeysInArray<T extends AnyObject>(arr: T[], keyMap: KeyMap): AnyObject[] {
    return arr.map(obj => renameKeys(obj, keyMap));
}
