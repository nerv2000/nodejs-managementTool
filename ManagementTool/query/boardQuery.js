'use strict'
const mysqlDB = require('../lib/mysqlDB');

module.exports = {
  /**
   * @description : DB에 들어있는 tblUser 테이블 갯수 읽어오는 함수 
   */
  userTableTotalCount: function(callback) {
    mysqlDB.query('SELECT COUNT(userNo) AS totalCount FROM tblUser', function (err, row) {
      if (err) {
        callback(err);
        return;
      }
      callback(err, row[0].totalCount)
    });
  },
  /**
   * @description : DB에 들어있는 tblUser 테이블 데이터 가지고 오는 함수 (파라미터는 그대로 써줘야 함)
   */
  userTableData: function(startNo, selectCount, pageInfo, callback) {
    mysqlDB.query(`
    SELECT userNo, nickName, userLv 
    FROM tblUser 
    ORDER BY userNo desc 
    LIMIT ?, ?
    `
    , [startNo, selectCount]
    , function (err, rows) {
      if (err) {
        callback(err);
        return;
      }
  
      callback(err, rows, pageInfo)
    });
  }
}
