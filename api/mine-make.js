/**
 * 做单相关api
 */

import {http, Method} from '@/utils/request.js';

/**
 * 做单列表
 * @param params
 */
export function queryMakeAccount(params) {
  return http.request({
    url: '/make/account/queryMakeAccount',
    method: Method.GET,
    params,
  });
}


/**
 * 获取积分
 * @param params
 */
export function getScore(params) {
  return http.request({
    url: '/score',
    method: Method.GET,
    params,
  });
}

/**
 * 做单
 * @param params
 */
export function makeAccount(params) {
  return http.request({
    url: '/make/account/makeAccount',
    method: Method.GET,
    params,
  });
}


/**
 * 获取店铺列表
 * @param params
 */
export function getStoreList(params) {
  return http.request({
    url: '/store/store/getMakeByPage',
    method: Method.GET,
    params,
  });
}

