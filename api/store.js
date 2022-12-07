/**
 * 店铺相关API
 */

import {http, Method} from '@/utils/request.js';


/**
 * app商铺入驻
 * @param  params
 */
export function settleIn(data){
	return http.request({
	  url: "/store/store/settleIn",
	  method: Method.POST,
	  needToken: true,
	  header: { "content-type": "application/x-www-form-urlencoded" },
	  data: data,
	});
}

/**
 * 获取商铺分类
 */
export function getCategoryList() {
  return http.request({
    url: `/goods/category`,
    method: Method.GET,
    loading: false,
  });
}


/**
 * 查询当前用户是那个区服务商
 * @param params
 */
export function getServiceProvider() {
  return http.request({
    url: "/passport/member/service/provider",
    method: Method.GET,
		needToken: true,
  });
}

/**
 * 根据分类获取商铺
 * @param params
 */
export function getStoreByCategoryList(params) {
  return http.request({
    url: "/store/store/by/category",
    method: Method.GET,
    params,
  });
}



/**
 * app商铺审核
 * @param storeId
 */
export function storeAudit(id,pass) {
  return http.request({
    url: `/store/store/audit/${id}/${pass}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * app商铺驳回
 * @param id
 */
export function reject(id) {
  return http.request({
    url: `/store/store/reject/${id}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取店铺列表
 * @param params
 */
export function getStoreList(params) {
  return http.request({
    url: '/store/store',
    method: Method.GET,
    params,
  });
}
/**
 * app获取店铺列表
 * @param params
 */
export function getAppByPage(params) {
  return http.request({
    url: '/store/store/getAppByPage',
    method: Method.GET,
    params,
  });
}

/**
 * 获取店铺基本信息
 * @param storeId
 */
 export function getStoreBaseInfo(storeId) {
  return http.request({
    url: `/store/store/get/detail/${storeId}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取店铺分类
 * @param id
 */
 export function getStoreCategory(id) {
  return http.request({
    url: `/store/store/label/get/${id}`,
    method: Method.GET,
  });
}


/**
 * 营业执照
 * @param id
 */
 export function getLicencePhoto(id) {
  return http.request({
    url: `/store/store/get/licencePhoto/${id}`,
    method: Method.GET,
  });
}

/**
 * 商家前十的
 */
 export function getStoreStatisticsTop(params) {
  return http.request({
    url: `/store/store/getStoreStatisticsTop`,
    method: Method.GET,
    params,
  });
}




