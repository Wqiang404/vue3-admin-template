import http from '@/store/http';
import { Response } from '@/types';

export const reqMenuList = (param) => {
  return http.request<Record<string, any>, Response<Record<string, any>>>('/v1/admin/menus', 'GET', param);
};
