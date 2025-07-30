import { deepClone, isNull, isNumber } from './helpers';

/**
 * 格式化金额
 * @param value
 * @param fixed
 * @returns
 */
export function formatMoney(value: number, fixed: number = 0) {
  let unit: string = value < 10000 ? '' : value < 100000000 ? 'w' : '亿';
  value = value < 10000 ? value : value < 100000000 ? value / 10000 : value / 100000000;
  let format: string = value.toFixed(fixed);
  const _val = format.split('.');
  const _int = _val[0],
    _dec = _val[1];
  return `${_val}${unit}`;
}

/**
 * 千位格式化
 * @param value
 * @param fixed
 * @returns
 */
export function formatThousand(value: number, fixed: number = 0): string {
  return value.toFixed(fixed).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 四舍五入金额，每隔3位逗号分隔，默认2位小数, 千分位格式化, nan,NaN值填充,自定义缩小倍率
export function formatAmountFillna({ cellValue }, digits = 2, fillVal = '-', shrink = null) {
  if (!isNull(shrink) && isNumber(shrink)) {
    return ['nan', 'NaN', 'inf', 'INF', '-', undefined, null].includes(cellValue) ? fillVal : formatThousand(Number(cellValue) / shrink, digits);
  } else {
    return ['nan', 'NaN', 'inf', 'INF', '-', undefined, null].includes(cellValue) ? fillVal : formatThousand(Number(cellValue), digits);
  }
}

export function formatTimestamp(date: Date = new Date(), str: string = '-'): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ].join(str);
}

export function formatMenuListToTree(arr) {
  const list = deepClone(arr);
  const treeList = list.filter((listItem) => !listItem.parent_id);
  treeList.sort((a, b) => a.sequence - b.sequence);
  function genChild(parentList) {
    parentList.forEach((item) => {
      item.title = item.name;
      item.key = item.id;
      delete item.hidden; // 去掉hidden字段，要不然tree会隐藏该节点
      item.children = list.filter((listItem) => listItem.parent_id === item.id);
      if (item.children.length) {
        item.children.sort((a, b) => a.sequence - b.sequence);
        genChild(item.children);
      }
    });
  }
  genChild(treeList);
  return treeList;
}

export function formatAllMenuListToTree(arr) {
  const list = deepClone(arr);
  const treeList = list.filter((listItem) => !listItem.parent_id);
  treeList.sort((a, b) => a.sequence - b.sequence);
  const treeParentList = treeList.map((item) => ({ label: item.name, value: item.id }));
  treeParentList.forEach((item) => {
    item.children = list
      .filter((listItem) => listItem.parent_id === item.value)
      .sort((a, b) => a.sequence - b.sequence)
      .map((childItem) => ({ label: childItem.name, value: childItem.id }));
  });
  return treeParentList;
}
