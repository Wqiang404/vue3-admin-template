import http from '@/store/http';
import { Response } from '@/types';

export const reqMenuList = (param) => {
  return http.request<Record<string, any>, Response<Record<string, any>>>('/v1/admin/menus', 'GET', param);
};

export const reqMenusUsers = (param) => {
  return http.request<Record<string, any>, Response<Record<string, any>>>('/v1/admin/menus/users', 'GET', param);
};

export const reqMenuDelete = (param) => {
  return http.request<Record<string, any>, Response<Record<string, any>>>(`/v1/admin/menus`, 'DELETE', param);
};

export const reqMenusAll = (param) => {
  return http.request<Record<string, any>, Response<Record<string, any>>>(`/v1/admin/menus/all`, 'GET', param);
};

export function reqMenuCreate(param) {
  return http.request<Record<string, any>, Response<Record<string, any>>>('/v1/admin/menus', 'POST_JSON', param);
}

export function reqMenuUpdate(param) {
  return http.request<Record<string, any>, Response<Record<string, any>>>('/v1/admin/menus', 'PATCH', param);
}
