import { isNull, isNumber } from './helpers';

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
    return ['nan', 'NaN', 'inf', 'INF', '-', undefined, null].includes(cellValue)
      ? fillVal
      : formatThousand(Number(cellValue) / shrink, digits);
  } else {
    return ['nan', 'NaN', 'inf', 'INF', '-', undefined, null].includes(cellValue)
      ? fillVal
      : formatThousand(Number(cellValue), digits);
  }
}
