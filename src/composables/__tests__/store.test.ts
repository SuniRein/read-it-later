import { fakeBrowser, storage } from '#imports';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import flushPromises from 'flush-promises';

import { useStoredValue } from '../store';

describe('useStoredValue', () => {
    beforeEach(() => {
        fakeBrowser.reset();
    });

    const defaultValue = { a: 1, b: 'Default value' };
    const initValue = { a: 2, b: 'Init value' };
    const updatedValue = { a: 3, b: 'Init value' };

    type TestType = { a: number; b: string };
    const testStorage = storage.defineItem<TestType>('local:test', { fallback: defaultValue });

    const testComponent = defineComponent({
        props: {},
        setup() {
            return {
                // avoid auto unwrapping of refs
                api: {
                    testValue: useStoredValue(testStorage),
                },
            };
        },
        render() {
            return null;
        },
    });

    async function getTestValue() {
        const wrapper = mount(testComponent);
        await flushPromises();
        return wrapper.vm.api.testValue;
    }

    it('initialize with default value when not available', async () => {
        const test = await getTestValue();
        expect(test.value).toEqual(defaultValue);
    });

    it('get store value if available', async () => {
        await testStorage.setValue(initValue);
        const test = await getTestValue();
        await flushPromises();
        expect(test.value).toEqual(initValue);
    });

    it('update store value when set', async () => {
        const test = await getTestValue();
        test.value.a = 3;
        await flushPromises();
        expect(await testStorage.getValue()).toHaveProperty('a', 3);
    });

    it('update sotre value when set with new object', async () => {
        const test = await getTestValue();
        test.value = updatedValue;
        await flushPromises();
        expect(await testStorage.getValue()).toEqual(updatedValue);
    });

    it('update local state when store value changes', async () => {
        const test = await getTestValue();
        await testStorage.setValue(updatedValue);
        await flushPromises();
        expect(test.value).toEqual(updatedValue);
        expect(await testStorage.getValue()).toEqual(updatedValue);
    });
});
