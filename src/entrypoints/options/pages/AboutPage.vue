<script setup lang="ts">
import Icon from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Divider,
  TypographyLink as Link,
  TypographyParagraph as Para,
  Space,
  Tag,
  TypographyTitle as Title,
  Typography,
} from 'ant-design-vue';
import { h } from 'vue';

import FirefoxLogo from '~~/assets/firefox.svg?component';
import GithubLogo from '~~/assets/github.svg?component';

import useI18n from '@/composables/i18n';
import * as meta from '@/utils/meta';

const { t } = useI18n();
</script>

<template>
  <Card bordered style="text-align: center">
    <Typography>
      <Space>
        <Title :level="2" style="display: inline;">
          {{ t('option.about.title') }}
        </Title>

        <Tag :bordered="false" color="purple">
          v{{ meta.version }}
        </Tag>
      </Space>

      <Para type="secondary">
        <i18n-t keypath="option.about.developedBy">
          <Link :href="meta.authorPage" target="_blank">
            {{ meta.author }}
          </Link>
        </i18n-t>
      </Para>

      <Para>
        {{ t('option.about.description') }}
      </Para>

      <Space>
        <Button :href="meta.repo" :icon="h(Icon, { component: GithubLogo })">
          Github
        </Button>

        <Button :href="meta.firefoxAddons" :icon="h(Icon, { component: FirefoxLogo })">
          Firefox
        </Button>
      </Space>

      <Divider />

      <Para>
        {{ t('option.about.privacy') }}
      </Para>

      <Para>
        <i18n-t keypath="option.about.license.info">
          <Link href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">
            {{ t('option.about.license.body') }}
          </Link>
        </i18n-t>
      </para>
    </Typography>
  </Card>
</template>
