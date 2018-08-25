'use strict'
const express = require('express');
const router = express.Router();

// 인증 체크 체크 
router.all('*', function (req, res, next) {
  if (true !== req.session.isLogin) {
    res.redirect('/');
    return;
  }
  next();
});

router.get('/', function (req, res) {

  const labels = ['Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13'];
  const data = [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451]

  res.render('page/dashboard', {
    pagePath: 'overview'
    ,labels: encodeURIComponent(JSON.stringify(labels))
    ,data
  });
});

module.exports = router;
