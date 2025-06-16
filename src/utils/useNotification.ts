import { notification } from 'ant-design-vue';
import type { NotificationPlacement } from 'ant-design-vue';

export function useNotification() {
  const api = notification;

  const openNotification = (desc: string, placement: NotificationPlacement = 'topRight', message: string = '提示') => {
    api.info({
      message: message,
      description: desc,
      placement,
    });
  };

  return {
    openNotification,
  };
}
