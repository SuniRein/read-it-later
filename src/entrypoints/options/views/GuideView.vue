<script setup lang="ts">
import { Info } from 'lucide-vue-next';
import * as meta from '@/utils/meta';

const { t } = useI18n();

const faqKeys = ['shortcut', 'searchByTag', 'IMP'];

const faqs = computed(() => faqKeys.map(key => ({
  key,
  question: t(`option.guide.faq.${key}.q`),
  answer: t(`option.guide.faq.${key}.a`),
})));
</script>

<template>
  <div class="flex flex-col gap-6 py-4">
    <h2 class="flex items-center gap-2 text-lg font-semibold">
      <Info class="size-5" /> {{ t('option.guide.section.faq') }}
    </h2>
    <Accordion type="single" collapsible class="w-full rounded-lg border bg-card px-4">
      <AccordionItem v-for="faq in faqs" :key="faq.key" :value="faq.key" class="border-b-0">
        <AccordionTrigger
          class="
            border-b py-4 text-left transition-colors
            hover:text-primary hover:no-underline
          "
        >
          {{ faq.question }}
        </AccordionTrigger>
        <AccordionContent class="py-4 leading-relaxed text-muted-foreground">
          {{ faq.answer }}
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <div class="rounded-lg border border-blue-100 bg-blue-50 p-4">
      <p class="flex items-start gap-2 text-sm text-blue-800">
        <Info class="mt-0.5 size-4 shrink-0" />
        <i18n-t keypath="option.guide.feedback" tag="span">
          <a :href="meta.issues" class="font-medium underline decoration-2 underline-offset-2">GitHub Issue</a>
        </i18n-t>
      </p>
    </div>
  </div>
</template>
