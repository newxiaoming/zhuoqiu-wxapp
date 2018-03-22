const LISTURL = 'http://zhuoqiuzhushou.test/api/players'
const SUBMITURL = 'http://zhuoqiuzhushou.test/api/player/submitgame'
const fetch = require('./fetch')

/**
 * 抓取豆瓣电影特定类型的API
 * https://developers.douban.com/wiki/?title=movie_v2
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi(url = LISTURL,params) {
  return fetch(url,params)
}

/**
 * 获取列表类型的数据
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       包含抓取任务的Promise
 */
function find(apiurl = LISTURL,count = '', id = '') {
  const params = { count: count, id:id }
  return fetchApi(apiurl,params)
    .then(res => res.data)
}

/**
 * 提交数据
 */
function submitgame(ids= '', banker_openid = '', is_end=0, winner= 0) {
  const params = { ids: ids,bk: banker_openid , _t:is_end , _w : winner }
  return fetchApi(SUBMITURL, params)
    .then(res => res.data)
}

/**
 * 获取单条类型的数据
 * @param  {Number} id     电影ID
 * @return {Promise}       包含抓取任务的Promise
 */
function findOne(id) {
  return fetchApi('subject/' + id)
    .then(res => res.data)
}

module.exports = { find, findOne, submitgame }