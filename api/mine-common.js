/**
 * 
 */

import {http, Method} from '@/utils/request.js';

/**
 * 根据类型获取配置
 * @param params
 */
export function queryConfigureByType(params) {
  return http.request({
    url: '/configure/queryConfigureByType',
    method: Method.GET,
    params,
  });
}
