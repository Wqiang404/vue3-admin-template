import { Component, DefineComponent } from 'vue';

type LazyComponent = () => Promise<Component | DefineComponent>;
// import.meta.glob 是 Vite 提供的一个功能，用于动态导入文件。
const modules: Record<string, LazyComponent> = import.meta.glob('./**/*.{ts,vue,tsx}');

type DynamicModule = { [key: string]: LazyComponent };

const Pages = Object.entries(modules).reduce((r, [key, _module]) => {
  key = key.replace(/^.\//, '@/pages/');
  r[key] = _module;
  if (/\/index.(js|ts|tsx|vue)/.test(key)) {
    r[key.replace(/\/index.(js|ts|tsx|vue)/, '')] = _module;
  }
  return r;
}, {} as DynamicModule);

export default Pages;
