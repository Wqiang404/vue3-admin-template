<script lang="ts" setup>
  import { useSettingStore, storeToRefs, navigationOptions } from '@/store';
  import { ref, watch } from 'vue';
  const { navigation, useTabs } = storeToRefs(useSettingStore());
  const { primaryColorValue, primaryColorChange } = useSettingStore();
  const emit = defineEmits<{
    (e: 'close'): void;
  }>();
  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const visible = ref(props.open);
  watch(
    () => props.open,
    (newVal) => {
      visible.value = newVal;
    }
  );
</script>
<template>
  <div>
    <a-drawer
      :width="400"
      title="主题编辑器"
      :closable="false"
      :placement="'right'"
      v-model:visible="visible"
      @close="$emit('close')"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="$emit('close')">重置</a-button>
        <a-button type="primary" @click="$emit('close')">保存</a-button>
      </template>
      <div class="flex justify-between leading-8 text-base font-bold mb-4">
        <span>主色</span>
        <arco-color-picker v-model="primaryColorValue" showText @change="primaryColorChange" />
      </div>
      <div class="flex justify-between leading-8 text-base font-bold mb-4">
        <span>导航模式</span>
        <a-radio-group v-model:value="navigation" :options="navigationOptions" />
      </div>
      <div class="flex justify-between leading-8 text-base font-bold mb-4">
        <span>多页签</span>
        <a-switch v-model:checked="useTabs" />
      </div>

      <a-divider />

      <div class="leading-8 text-base font-bold mb-4">
        <span>预设主题</span>
      </div>
    </a-drawer>
  </div>
</template>
<style scoped lang="less"></style>
