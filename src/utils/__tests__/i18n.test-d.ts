import type enSchema from '~~/assets/locales/en.json';
import type zhCNSchema from '~~/assets/locales/zh_CN.json';
import type enSchemaP from '~~/public/_locales/en/messages.json';
import type zhCNSchemaP from '~~/public/_locales/zh_CN/messages.json';
import { expectTypeOf, it } from 'vitest';

it('i18n files should have same keys', () => {
  type EnSchema = typeof enSchema;
  type ZhCNSchema = typeof zhCNSchema;
  expectTypeOf<EnSchema>().toEqualTypeOf<ZhCNSchema>();

  type EnSchemaP = typeof enSchemaP;
  type ZhCNSchemaP = typeof zhCNSchemaP;
  expectTypeOf<EnSchemaP>().toEqualTypeOf<ZhCNSchemaP>();
});
