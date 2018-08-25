const express = require('express');
const router = express.Router();

const board = require('../lib/board');
const boardQuery = require('../query/boardQuery');
const pageRoot = '유저 / '

// 인증 체크 체크 
router.all('*', function (req, res, next) {
  if (true !== req.session.isLogin) {
    res.redirect('/');
    return;
  }
  next();
});

router.get('/list', function (req, res) {
  res.redirect(req.baseUrl + '/list/1');
});

router.get('/list/:pageNo', function (req, res, next) {
  board.boardSelect(req.params.pageNo
    , boardQuery.userTableTotalCount
    , boardQuery.userTableData
    , function (err, tableDatas, pageInfo) {
      if (err) {
        console.error(err);
        next(Error(500));
        return;
      }

      res.render('page/userAllList', {
        pagePath: pageRoot + '전체 유저 목록'
        , tableDatas
        , pageInfo
      });
    });
});

router.get('/find', function (req, res) {
  res.render('page/userFind', {
    pagePath: pageRoot + '특정 유저 찾기'
  });
});

module.exports = router;