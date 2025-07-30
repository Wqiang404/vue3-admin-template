import { notification } from 'ant-design-vue';
import type { NotificationPlacement } from 'ant-design-vue';

export function useNotification() {
  const api = notification;

  const openNotification = (desc: string, message: string = '提示', placement: NotificationPlacement = 'topRight') => {
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
