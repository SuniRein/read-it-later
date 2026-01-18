import { toRaw } from 'vue';

export function deepToRaw<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(deepToRaw) as unknown as T;
    }
    else if (value != null && typeof value === 'object') {
        const rawObject: Record<string, any> = {};
        for (const key in value) {
            rawObject[key] = deepToRaw(value[key]);
        }
        return rawObject as T;
    }
    return toRaw(value);
}
