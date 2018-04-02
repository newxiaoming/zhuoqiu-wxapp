const DOMAIN = 'https://x.tfcaijing.com/index.php'
const LISTURL = DOMAIN + '/api/players'
const SUBMITURL = DOMAIN + '/api/player/submitgame'
const SUBMITBETURL = DOMAIN + '/api/zhuqiugame/submitbet'
const GETBETURL = DOMAIN + '/api/zhuqiugame/getbet'
const GETWINNERURL = DOMAIN + '/api/zhuqiugame/getbetresult'
const CHECKUSER = DOMAIN + '/api/checkuser'
const GETGAMERS = DOMAIN + '/api/zhuoqiugame/getgamers'
const fetch = require('./fetch')
const fetchpost = require('./fetchpost')

/**
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi(url = LISTURL,params) {
  return fetch(url,params)
}

/**
 * @param  {String} type   类型，POST
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApiPost(url = LISTURL, params) {
  return fetchpost(url, params)
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
function submitgame(ids= '', banker_openid = '', is_end=0, winner= 0, game_id = 0) {
  const params = { ids: ids,bk: banker_openid , _t:is_end , _w : winner, _g : game_id }
  return fetchApi(SUBMITURL, params)
    .then(res => res.data)
}

/**
 * 提交投注
 * user 投注人微信openid
 * gamer 投注的选手ID
 * game_id  游戏ID
 */
function submitBet(user = '', gamer = 0, game_id = 0, money = 0, avatarUrl = '') {
  const params = { user: user, gamer: gamer, _g: game_id, _m: money, avatarUrl: avatarUrl}
  return fetchApi(SUBMITBETURL, params)
    .then(res => res.data)
}

/**
 * 获取投注
 * game_id  游戏ID
 */
function getBet(game_id = 0,ids,openid) {
  const params = { _g: game_id, ids:ids,_id: openid }
  return fetchApi(GETBETURL, params)
    .then(res => res.data)
}

/**
 * 胜方
 * game_id  游戏ID
 */
function getWinner(game_id = 0, openid) {
  const params = { _g: game_id, _id: openid }
  return fetchApi(GETWINNERURL, params)
    .then(res => res.data)
}

/**
 * 检查用户
 */
function checkuser(code, rawData, signature,encryptData,iv)
{
  const params = { code: code, rawData: rawData, signature: signature,encryptData:encryptData, iv:iv }
  return fetchApiPost(CHECKUSER, params)
    .then(res => res.data)
}

/**
 * 选手
 * game_id  游戏ID
 */
function getGamers(game_id = 0,) {
  const params = { _g: game_id }
  return fetchApi(GETGAMERS, params)
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

module.exports = { find, findOne, submitgame, submitBet, getBet, getWinner, checkuser, getGamers}