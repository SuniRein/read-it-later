import { fakeBrowser, storage } from '#imports';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import flushPromises from 'flush-promises';

import { useStoredValue } from '@/utils/store';

describe('useStoredValue', () => {
    beforeEach(() => {
        fakeBrowser.reset();
    });

    type TestType = string;
    const testStorage = storage.defineItem<TestType>('local:test');

    const defaultValue = 'Default value';
    const initValue = 'Init value';
    const updatedValue = 'Updated value';

    const testComponent = defineComponent({
        props: {},
        setup() {
            return {
                // avoid auto unwrapping of refs
                api: {
                    testValue: useStoredValue(testStorage, defaultValue),
                },
            };
        },
    });

    async function getTestValue() {
        const wrapper = mount(testComponent);
        await flushPromises();
        return { wrapper, test: wrapper.vm.api.testValue };
    }

    it('initialize with default value when not available', async () => {
        const { test } = await getTestValue();
        expect(test.value).toBe(defaultValue);
    });

    it('get store value if available', async () => {
        await testStorage.setValue(initValue);
        const { test } = await getTestValue();
        await flushPromises();
        expect(test.value).toBe(initValue);
    });

    it('update store value when set', async () => {
        const { test } = await getTestValue();
        test.value = updatedValue;
        await flushPromises();
        expect(test.value).toBe(updatedValue);
        expect(await testStorage.getValue()).toBe(updatedValue);
    });

    it('update local state when store value changes', async () => {
        const { test } = await getTestValue();
        await testStorage.setValue(updatedValue);
        await flushPromises();
        expect(test.value).toBe(updatedValue);
        expect(await testStorage.getValue()).toBe(updatedValue);
    });
});
