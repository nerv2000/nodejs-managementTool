'use strict'
const config = require('../lib/config').load();
const mysqlDB = require('../lib/mysqlDB');
const CryptoJS = require("crypto-js");

/////////////////////////////////////////////////////////////////////
// 참고 : sp와 query 에 있는 aes 암호화 해주는것은 호환 안됨 한가지만 쓸껏
//////////////////////////////////////////////////////////////////////

module.exports = {
  loginCheckSp: function(accountId, password, callback) {
    mysqlDB.query(`CALL uspAdminLoginCheck(?, ?, ?)`
    , [accountId, password, config.etc.salt], function(err, results){
      if(err) {
        callback(err);
        return;
      }
      callback(null, results[1][0].error);
    });
  },
  createAdminSp: function(accountId, password, callback) {
    mysqlDB.query(`CALL uspAdminCreate(?, ?)`
    ,[accountId, encryptPw], function(err, results){
      if(err) {
        callback(err);
        return;
      }
      
      callback(null, results[0][0].error);
    });
  },
  loginCheckQuery: function(accountId, password, callback) {
    mysqlDB.query(`SELECT adminNo, pw FROM tblAdmin WHERE accountId = ?`
    , [accountId]
    , function(err, results) {
      if(err) {
        callback(err);
        return;
      }

      // 계정 없음
      if(0 == results.lenght) {
        callback(null, -1);
        return;
      }

      const pw = results[0].pw;      
      const key = password+config.etc.salt;
      const bytes = CryptoJS.AES.decrypt(pw, key);
      const decryptPw = bytes.toString(CryptoJS.enc.Utf8);

      // 암호 틀림
      if(password !== decryptPw) {
        callback(null, -2);
        return;
      }

      // 정상
      callback(null, 0);
      
    });
  },
  createAdminQuery: function(accountId, password, callback) {
    const encryptPw = CryptoJS.AES.encrypt(password, password+config.etc.salt);

    mysqlDB.query(`INSERT INTO tblAdmin(accountId, pw) VALUES(?, ?)`
    , [accountId, encryptPw.toString()]
    , function(err, results) {
      if(err) {
        callback(null, -1);
        return;
      }

      callback(null, 0);
    });
  }
}