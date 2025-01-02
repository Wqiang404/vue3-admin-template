<script lang="ts" setup>
  import { useSettingStore, storeToRefs, navigationOptions } from '@/store';
  import { ref, watch } from 'vue';
  import { configTheme, themeList } from '@/theme';

  const { navigation, useTabs, theme } = storeToRefs(useSettingStore());
  const { setTheme } = useSettingStore();
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
  const themeChange = (key) => {
    configTheme(key);
    setTheme(key);
  };
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
      <div class="config-item">
        <span>主色</span>
        <arco-color-picker v-model="primaryColorValue" showText @change="primaryColorChange" />
      </div>
      <div class="config-item">
        <span>导航模式</span>
        <a-radio-group v-model:value="navigation" :options="navigationOptions" />
      </div>
      <div class="config-item">
        <span>多页签</span>
        <a-switch v-model:checked="useTabs" />
      </div>

      <a-divider />

      <div>
        <div class="config-item">
          <span>预设主题</span>
        </div>
        <div class="flex flex-row flex-wrap">
          <div
            class="img-checkbox relative"
            v-for="themeItem in themeList"
            :key="themeItem.key"
            @click="() => themeChange(themeItem.key)"
          >
            <a-tooltip :title="themeItem.title">
              <img width="96" class="img-checkbox-img" :src="themeItem.imgUrl" />
              <CheckOutlined
                class="img-checkbox-icon"
                style="color: var(--color-primary-6)"
                v-show="themeItem.key === theme"
              />
            </a-tooltip>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<style scoped lang="less">
  .config-item {
    @apply flex justify-between leading-8 text-base font-bold mb-4;
  }
  .img-checkbox {
    margin-left: var(--margin-xs);
    margin-right: var(--margin-xs);
    margin-bottom: var(--margin-sm);
  }
  .img-checkbox:hover {
    --tw-translate-y: -2px;
    --tw-scale-x: 1.05;
    --tw-scale-y: 1.05;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
      skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }
  .img-checkbox-icon {
    position: absolute;
    bottom: 50%;
    left: 50%;
    --tw-translate-y: 50%;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
      skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    font-size: var(--font-size-xxl);
    line-height: var(--leading);
    color: var(--color-primary-6);
  }
</style>
