<script lang="ts" setup>
import { computed } from 'vue'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useBreadcrumbs } from '@/composables/breadcrumbs'
import { RouterLink } from 'vue-router'

import { useRoute } from 'vue-router'

import { defineBreadcrumb, useSchemaOrg } from '@unhead/schema-org/vue'
const { breadcrumbs } = useBreadcrumbs()

const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

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

const route = useRoute()
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
