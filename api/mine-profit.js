/**
 * 
 */

import {http, Method} from '@/utils/request.js';

/**
 * 区域-子区域收益
 * @param params
 */
export function profitArea(params) {
  return http.request({
    url: '/profit/area',
    method: Method.POST,
    params,
  });
}

/**
 * 会员收益
 * @param params
 */
export function profitMember(params) {
  return http.request({
    url: '/profit/member',
    method: Method.POST,
    params,
  });
}
