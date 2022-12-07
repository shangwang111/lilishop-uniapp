/**
 * 
 */

import {http, Method} from '@/utils/request.js';

/**
 * 查询我的邀请人列表
 * @param params
 */
export function queryInvitation(params) {
	return http.request({
		url: '/my/invitation/queryInvitation',
		method: Method.GET,
		params,
	});
}

/**
 * 查询我邀请的区域
 * @param {Object} params
 * @param {Object} regionId
 */
export function queryInvitationRegion(params, regionId) {
	console.log(params,regionId)
	return http.request({
		url: `/my/invitation/queryInvitationRegion/${regionId}`,
		method: Method.GET,
		params,
	});
}

/**
 * 查询我的邀请人
 * @param params
 */
export function queryMyInvitee(params) {
	return http.request({
		url: '/my/invitation/queryMyInvitee',
		method: Method.GET,
		params,
	});
}

/**
 * 查询是否绑定邀请人
 */
export function checkInvitee() {
	return http.request({
		url: '/my/invitation/checkInvitee',
		method: Method.GET
	});
}
/**
 * 绑定邀请人
 * @param params
 */
export function bindInvitee(params) {
	return http.request({
		url: '/my/invitation/bind/invitee',
		method: Method.GET,
		params,
	});
}





