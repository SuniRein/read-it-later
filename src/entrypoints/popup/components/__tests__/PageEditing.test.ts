import { mount } from '@vue/test-utils';

import { describe, expect, it } from 'vitest';
import PageEditing from '../PageEditing.vue';

const defaultTitle = 'Test Title';
const defaultTags = ['tag1', 'tag2'];

function setup({ title, tags }: { title?: string; tags?: string[] }) {
    const wrapper = mount(PageEditing, {
        props: {
            initTitle: title ?? defaultTitle,
            initTags: tags ?? defaultTags,
        },
    });

    function titleInput() {
        return wrapper.findAll('input')[0];
    }

    function tagsInput() {
        return wrapper.findAll('input')[1];
    }

    async function triggerCancel() {
        await wrapper.findAll('button')[0].trigger('click');
    }

    async function triggerSave() {
        await wrapper.findAll('button')[1].trigger('click');
    }

    return {
        wrapper,
        titleInput,
        tagsInput,
        triggerCancel,
        triggerSave,
    };
}

it('shows the title and tags', () => {
    const { titleInput, tagsInput } = setup({});

    expect(titleInput().element.value).toBe(defaultTitle);
    expect(tagsInput().element.value).toBe(defaultTags.join(', '));
});

it('buttons trigger cancel and save', async () => {
    const { wrapper, triggerCancel, triggerSave } = setup({});

    await triggerCancel();
    expect(wrapper.emitted()).toHaveProperty('cancel');

    await triggerSave();
    expect(wrapper.emitted()).toHaveProperty('save');
});

it('updates title and tags on input', async () => {
    const { wrapper, titleInput, tagsInput, triggerSave } = setup({});

    await titleInput().setValue('New Title');
    await tagsInput().setValue('newtag1, newtag2');
    await triggerSave();

    expect(wrapper.emitted('save')?.[0]).toEqual(['New Title', ['newtag1', 'newtag2']]);
});

it('cancel button does not save changes', async () => {
    const { wrapper, titleInput, tagsInput, triggerCancel } = setup({});

    await titleInput().setValue('Changed Title');
    await tagsInput().setValue('changedtag1, changedtag2');
    await triggerCancel();

    expect(wrapper.emitted('cancel')).toBeTruthy();
    expect(wrapper.emitted('save')).toBeUndefined();
});

describe('tags validation', () => {
    it('tags are parsed correctly', async () => {
        const { wrapper, tagsInput, triggerSave } = setup({});

        await tagsInput().setValue('tag1, another-tag, that_tag3');
        await triggerSave();

        expect(wrapper.emitted('save')?.[0]).toEqual(['Test Title', ['tag1', 'another-tag', 'that_tag3']]);
    });

    it.each([
        'invalid tag',
        'invalid)tag',
        '#invalid_tag',
    ])('invalid tags `%s` are not saved', async (invalidTag) => {
        const { wrapper, tagsInput, triggerSave } = setup({});

        await tagsInput().setValue(invalidTag);
        await triggerSave();

        expect(wrapper.emitted('save')).toBeUndefined();
    });

    it('chinese characters are allowed in tags', async () => {
        const { wrapper, tagsInput, triggerSave } = setup({});

        await tagsInput().setValue('中文标签, tag混合_测试');
        await triggerSave();

        expect(wrapper.emitted('save')?.[0]).toEqual(['Test Title', ['中文标签', 'tag混合_测试']]);
    });
});
