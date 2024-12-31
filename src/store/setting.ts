import { RadioGroupProps } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useThemeStore } from 'stepin/es/theme-provider';

export type Navigation = 'side' | 'head' | 'mix';
export const navigationOptions: RadioGroupProps['options'] = [
  { label: '侧边', value: 'side' },
  { label: '顶部', value: 'head' },
  { label: '混合', value: 'mix' },
];

export const useSettingStore = defineStore('setting', () => {
  const navigation = ref<Navigation>('head');
  const useTabs = ref<boolean>(true);
  const theme = ref('header-dark');
  const contentClass = ref('common');
  const filterMenu = ref(false);
  const primaryColorValue = useThemeStore().theme.color.primary.DEFAULT;
  const { setPrimaryColor, setBgSeriesColors, setTextSeriesColors } = useThemeStore();

  const primaryColorChange = (color: string) => {
    setPrimaryColor({ DEFAULT: color });
  };

  function setNavigation(nav: Navigation) {
    navigation.value = nav;
  }
  function setTheme(value: string) {
    theme.value = value;
  }
  function setContentClass(className: string) {
    contentClass.value = className;
  }
  function setFilterMenu(filter: boolean) {
    filterMenu.value = filter;
  }
  return {
    navigation,
    useTabs,
    theme,
    contentClass,
    filterMenu,
    primaryColorValue,
    primaryColorChange,
    setNavigation,
    setTheme,
    setContentClass,
    setFilterMenu,
  };
});
