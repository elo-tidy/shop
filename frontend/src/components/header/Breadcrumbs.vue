<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
// ui
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
// composables
import { useBreadcrumbs } from '@/composables/breadcrumbs'
// Schema Org
import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue'

const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

const { breadcrumbs } = useBreadcrumbs()
const breadcrumbsSchema = computed(() =>
  breadcrumbs.value.map((crumb, index) => {
    const item: Record<string, any> = {
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
    }
    if (crumb.path) {
      item.item = baseUrl ? new URL(crumb.path, baseUrl).href : crumb.path
    }
    return item
  }),
)
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbsSchema,
  }),
])
</script>

<template>
  <Breadcrumb role="navigation" class="border-b pb-3 mb-10">
    <BreadcrumbList>
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="index < breadcrumbs.length - 1" as-child>
            <RouterLink :to="crumb.path">{{ crumb.name }}</RouterLink>
          </BreadcrumbLink>
          <BreadcrumbPage v-else
            ><span class="sr-only">Page active : </span>{{ crumb.name }}</BreadcrumbPage
          >
        </BreadcrumbItem>

        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
