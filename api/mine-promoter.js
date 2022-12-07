/**
 * 
 */

import {http, Method} from '@/utils/request.js';

/**
 * 区域推广员添加
 * @param params
 */
export function addOfPromoters(params) {
  return http.request({
    url: '/regional/addOfPromoters',
    method: Method.GET,
    params,
  });
}

/**
 * 区域推广员删除
 * @param params
 */
export function deleteOfPromoters(params) {
  return http.request({
    url: '/regional/deleteOfPromoters',
    method: Method.GET,
    params,
  });
}

/**
 * 区域推广员列表
 * @param params
 */
export function listOfPromoters(params) {
  return http.request({
    url: '/regional/listOfPromoters',
    method: Method.GET,
    params,
  });
}

/**
 * 区域推广员修改
 * @param params
 */
export function updateOfPromoters(params) {
  return http.request({
    url: '/regional/updateOfPromoters',
    method: Method.GET,
    params,
  });
}

/**
 * 区域代理
 * @param params
 */
export function queryServiceProvider(params) {
  return http.request({
    url: '/regional/serviceProvider',
    method: Method.GET,
    params,
  });
}

