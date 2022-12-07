/**
 * 
 */

import {http, Method} from '@/utils/request.js';

/**
 * 挂单列表
 * @param params
 */
export function listOfPendingOrders(params) {
  return http.request({
    url: '/pendingOrderForm/listOfPendingOrders',
    method: Method.GET,
    params,
  });
}


/**
 * 插入挂单
 * @param params
 */
export function insertPendingOrder(params) {
  return http.request({
    url: '/pendingOrderForm/insertPendingOrder',
    method: Method.GET,
    params,
  });
}



/**
 * 联系人信息
 * @param params
 */
export function contactInformation(params) {
  return http.request({
    url: '/pendingOrderForm/contactInformation',
    method: Method.GET,
    params,
  });
}

/**
 * 删除挂单
 * @param params
 */
export function deletePendingOrder() {
  return http.request({
    url: '/pendingOrderForm/deletePendingOrder',
    method: Method.GET
  });
}

/**
 * 修改挂单
 * @param params
 */
export function updatePendingOrder(params) {
  return http.request({
    url: '/pendingOrderForm/updatePendingOrder',
    method: Method.GET,
    params,
  });
}

/**
 * 当前用户挂单信息
 * @param params
 */
export function pendingOrderInformation() {
  return http.request({
    url: '/pendingOrderForm/pendingOrderInformation',
    method: Method.GET,
  });
}

