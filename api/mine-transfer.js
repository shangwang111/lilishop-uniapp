/**
 * 转入转出接口
 */

import {http, Method} from '@/utils/request.js';

/**
 * 转入明细
 * @param params
 */
export function transferInDetails(params) {
  return http.request({
    url: '/my/transfer/in/details',
    method: Method.POST,
    params,
  });
}

/**
 * 转出明细
 * @param params
 */
export function transferOutDetails(params) {
  return http.request({
    url: '/my/transfer/out/details',
    method: Method.POST,
    params,
  });
}

/**
 * 转账
 * @param params
 */
export function transferAccounts(params) {
  return http.request({
    url: '/my/transfer/accounts',
    method: Method.POST,
    params,
  });
}

