'use strict'
const express = require('express');
const router = express.Router();
const loginQuery = require('../query/loginQuery');

router.get('/login', function (req, res) {
  const errorCode = req.session.errorCode;
  req.session.errorCode = undefined;

  res.render('./authentication/login', {
    layout: false
    , errorCode
  });

});

router.post('/loginCheck', function (req, res) {
  const userId = req.body.userId;
  const pw = req.body.pw;

  loginQuery.loginCheckQuery(userId, pw, function (err, queryError) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'db check fail!!' });
      return;
    }

    // 로그인 인증 체크 
    if (0 === queryError) {
      req.session.isLogin = true;
      res.redirect('/');
    } else {
      //로그인 실패 
      // -1 : 계정 없음
      // -2 : 비번 틀림
      req.session.errorCode = queryError;
      res.redirect('/login');
    }
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      return;
    }

    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

router.get('/register', function (req, res) {
  const errorCode = req.session.errorCode;
  req.session.errorCode = undefined;

  res.render('./authentication/register', {
    layout: false
    , errorCode
  });
});

router.post('/registerCheck', function (req, res) {
  const userId = req.body.userId;
  const pw = req.body.pw;

  //1. 계정 가입처리
  loginQuery.createAdminQuery(userId, pw, function(err, queryError) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'db check fail!!' });
      return;
    }

    // 동일한 계정이 있는 경우
    if(-1 == queryError) {
      req.session.errorCode = -1;
      res.redirect('/register');
      return;
    }

    req.session.errorCode = 1;
    res.redirect('/login');
   });
 });

module.exports = router;
