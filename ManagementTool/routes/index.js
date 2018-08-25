'use strict'
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  if (true === req.session.isLogin) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login')
  }
});

module.exports = router;
