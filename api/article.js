/**
 * 文章相关API
 */

import {http,Method} from '@/utils/request.js';
import api from '@/config/api.js';

/**
 * 获取某个分类的文章列表
 * @param category_type
 */
export function getArticleCategory(category_type) {
  return http.request({
    url: `${api.base}/pages/article-categories`,
    method: Method.GET,
    params: {category_type},
  });
}

/**
 * 获取联德新闻获取
 * @param params
 */
export function getNewList(params) {
  return http.request({
    url: `/other/article/getNewList`,
    method: Method.GET,
		params
  });
}

/**
 * 获取文章详情
 * @param id
 */
export function getArticleDetail(id) {
  return http.request({
    url: `/other/article/get/${id}`,
    method: Method.GET,
  });
}

/**
 * 获取协议
 * @param type
 */
export function getArticleXie(type) {
  return http.request({
    url: `/other/article/type/${type}`,
    method: Method.GET,
  });
}


