<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton'
</script>
<template>
  <div>
    <!-- TITLE -->
    <Skeleton class="h-7.5 w-72 mb-10" />

    <!-- TABS WRAPPER -->
    <div class="flex flex-col gap-2">
      <!-- TabsList -->
      <div
        class="bg-muted inline-flex h-9 w-fit items-center justify-center rounded-lg p-0.75 mb-6"
      >
        <Skeleton class="h-7 w-44 rounded-md mr-1" />
        <Skeleton class="h-7 w-44 rounded-md" />
      </div>

      <!-- TabsContent -->
      <div class="flex-1">
        <!-- Add button -->
        <Skeleton class="h-9 w-64 mb-4 rounded-md" />

        <!-- counter -->
        <Skeleton class="h-4 w-40 mb-4" />

        <!-- GRID (exact same structure as your list) -->
        <div class="grid gap-y-2">
          <div
            v-for="i in 4"
            :key="i"
            class="bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm relative card gap-0 py-4 grid-tpl admin grid-tpl skeleton-card"
          >
            <!-- ID -->
            <div class="mr-4 place-content-center">
              <Skeleton class="h-4 w-6" />
            </div>

            <Skeleton class="img h-20 w-full" />

            <div class="card-header">
              <div class="grid auto-rows-min gap-1.5 px-6 grid-cols-[1fr_auto] gap-x-4">
                <Skeleton class="h-5 w-3/5" />
                <Skeleton class="h-5 w-20" />
              </div>
              <div class="grid gap-1.5 px-6 mt-3">
                <Skeleton class="h-5 w-full" />
                <Skeleton class="h-5 w-full" />
              </div>
            </div>

            <!-- STOCK / ARCHIVED -->
            <div class="grid place-content-center pr-6">
              <Skeleton class="h-6 w-18" />
              <Skeleton class="h-6 w-18 archived px-2 mt-2" />
            </div>

            <!-- FOOTER ADMIN (grid-flow-col gap-4) -->
            <div class="grid place-content-center grid-flow-col gap-4">
              <Skeleton class="h-10 w-10 rounded-md" />
              <Skeleton class="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
