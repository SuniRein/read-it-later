<script setup lang="ts">
import FirefoxLogo from '~~/assets/firefox.svg?component';
import GithubLogo from '~~/assets/github.svg?component';
import * as meta from '@/utils/meta';

const { t } = useI18n();
</script>

<template>
  <Card class="mx-auto max-w-2xl text-center">
    <CardHeader>
      <div class="flex items-center justify-center gap-2">
        <CardTitle class="text-3xl font-semibold tracking-tight">
          {{ t('common.title') }}
        </CardTitle>
        <Badge variant="secondary" class="bg-purple-100 text-purple-700">
          v{{ meta.version }}
        </Badge>
      </div>

      <p class="text-sm text-muted-foreground">
        <i18n-t keypath="option.about.developedBy">
          <a
            :href="meta.authorPage" target="_blank" class="
              text-primary underline-offset-4
              hover:underline
            "
          >
            {{ meta.author }}
          </a>
        </i18n-t>
      </p>
    </CardHeader>

    <CardContent>
      <CardDescription class="mb-4 text-sm/7">
        {{ t('option.about.desc') }}
      </CardDescription>

      <div class="flex items-center justify-center gap-4">
        <Button variant="outline" as-child>
          <a :href="meta.repo">
            <GithubLogo class="size-4" /> Github
          </a>
        </Button>

        <Button variant="outline" as-child>
          <a :href="meta.firefoxAddons">
            <FirefoxLogo class="size-4" /> Firefox
          </a>
        </Button>
      </div>
    </CardContent>

    <CardFooter class="flex flex-col gap-2 border-t pt-4">
      <p class="text-muted-foreground">
        {{ t('option.about.privacy') }}
      </p>

      <p class="text-muted-foreground">
        <i18n-t keypath="option.about.license.info">
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            class="
              text-primary underline-offset-4
              hover:underline
            "
          >
            {{ t('option.about.license.body') }}
          </a>
        </i18n-t>
      </p>
    </CardFooter>
  </Card>
</template>
