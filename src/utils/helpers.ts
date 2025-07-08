import * as icons from '@arco-design/web-vue/es/icon';

/**
 * 初始化目标值为 undefined 的属性
 * @param target 目标对象
 * @param dft 默认值对象
 */
export function initUndefined<T extends Record<string, any>, K extends keyof T>(target: T, dft: Required<Pick<T, K>>) {
  (Object.keys(dft) as K[]).forEach((key) => (target[key] = target[key] ?? dft[key]));
}

export function isNull(value) {
  return value === null || value === undefined;
}

export function isNumber(value: any) {
  // 使用正则表达式判断是否为数字，允许正负号、小数点和科学计数法
  // const regex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
  // return typeof value === 'string' ? regex.test(value) : typeof value === 'number';
  return typeof value === 'number' && !isNaN(value);
}

export function getQueryObject(url = location.href) {
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

export function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = JSON.stringify(item);
    return seen.has(key) ? false : seen.add(key);
  });
}

export function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  const clone: T = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

export function getIconMap() {
  // 创建图标映射表
  const iconMap = new Map();
  Object.keys(icons).forEach((key) => {
    if (key.startsWith('Icon')) {
      const name = key.replace('Icon', '').toLowerCase();
      iconMap.set(name, icons[key]);
    }
  });
  return iconMap;
}
