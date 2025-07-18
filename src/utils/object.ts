import { toRaw } from 'vue';

export function deepEqual(a: any, b: any): boolean {
    if (a === b)
        return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null)
        return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length)
        return false;

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key]))
            return false;
    }

    return true;
}

export function deepToRaw<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(deepToRaw) as unknown as T;
    }
    else if (value && typeof value === 'object') {
        const rawObject: Record<string, any> = {};
        for (const key in value) {
            rawObject[key] = deepToRaw(value[key]);
        }
        return rawObject as T;
    }
    return toRaw(value);
}
