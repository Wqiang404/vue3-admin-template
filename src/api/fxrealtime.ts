import http from '@/store/http';
import { Response } from '@/types';

export interface DefaultProps {
  [key: string | number]: any;
}

export interface OptionMatureProps {
  tableData: any;
  tableLabel: string;
  lastupdatetime: string;
}
export interface TenorProps {
  [key: string | number]: any;
}
export interface SimulationProps {
  [key: string | number]: any;
}

export const reqOptionMature = (param) => {
  return http.request<OptionMatureProps, Response<OptionMatureProps>>('/v2/position/option/mature', 'GET', param);
};

export const reqFxRealTimeTenor = (param) => {
  return http.request<TenorProps, Response<TenorProps>>('/v2/position/fxRealTime/tenor', 'GET', param);
};

export const reqFxRealTimeSimulation = (param) => {
  return http.request<SimulationProps, Response<SimulationProps>>('/v2/position/fxRealTime/simulation', 'GET', param);
};

export const reqFxRealTimeCondition = (param) => {
  return http.request<DefaultProps, Response<DefaultProps>>('/v2/position/fxRealTime/condition', 'GET', param);
};

export const reqFxRealTime = (param) => {
  return http.request<DefaultProps, Response<DefaultProps>>('/v2/position/fxRealTime', 'GET', param);
};

export const reqFxRealTimeLastDay = () => {
  return http.request<DefaultProps, Response<DefaultProps>>('/v2/position/fxRealTime/total-last-day', 'GET');
};

export const reqFxRealTimeTeamEnumerate = () => {
  return http.request<DefaultProps, Response<DefaultProps>>('/v2/position/fxRealTime/team-enumerate', 'GET');
};

export const reqFxRealTimeTenorEnumerate = (param) => {
  return http.request<DefaultProps, Response<DefaultProps>>('/v2/position/fxRealTime/tenor-enumerate', 'GET', param);
};

export const reqFxRealTimeSimulationEnumerate = (param) => {
  return http.request<DefaultProps, Response<DefaultProps>>(
    '/v2/position/fxRealTime/simulation-enumerate',
    'GET',
    param
  );
};
