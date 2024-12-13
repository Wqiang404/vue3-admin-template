<template>
  <ThemeProvider :color="{ middle: { 'bg-base': '#fff' } }">
    <div ref="demo" class="demo p-2 mb-4">demo</div>
  </ThemeProvider>
</template>

<script lang="ts" setup>
  import { ThemeProvider } from 'stepin';
</script>
