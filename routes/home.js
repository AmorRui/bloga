const express = require('express');

const moment = require('moment');

const users = require('../models/users');

const posts = require('../models/posts');

const home = express.Router();

home.get('/', (req, res) => {
  // 处理分页
  let page = req.query.page || 1;
  // 每页数据
  let size = req.query.size || 3;

  // 处理日期
  posts.find(page, size, (err, rows) => {
    rows.forEach(function (val, key) {
      rows[key].time = moment(rows[key].time).format('DD MMMM YYYY');
    })
    posts.count((err, row) => {
      // console.log(row);
      res.render("home/index", {
        posts: rows,
        page: page,
        total: Math.ceil(row.total / size)
      })
    })

  })

});
// 注册页面
home.get('/register', (req, res) => {
  res.render('home/register', {})
})
// 注册逻辑
home.post('/register', (req, res) => {
  // console.log(req.body);
  // 添加用户
  users.addUser(req.body, (err) => {
    console.log(err)
    if (!err) {
      res.json({
        code: 10000,
        msg: '注册成功！'
      })
    }
  });
})
// 登陆页面
home.get('/login', (req, res) => {
  res.render('home/login', {})
})
// 登陆逻辑
home.post('/login', (req, res) => {
  // console.log(req.body);

  users.auth(req.body, (err, loginfo) => {
    // console.log(err);

    if (!err) {
      // 记录session 
      // req.session.loginfo = "Amor";
      req.session.loginfo = loginfo;

      return res.json({
        code: 10000,
        msg: "登陆成功！"
      });
    }

    res.json({
      code: 10001,
      msg: "用户名或者密码错误！"
    })
  });

})
// 退出登陆
home.get('/logout', (req, res) => {
  req.session.loginfo = null;
  // 跳转到前台首页 ajax不支持跳转
  // res.redirect('/');
  res.json({
    code: 10000,
    msg: "退出成功！！"
  })
})
// 文章详情
home.get('/article', (req,res) => {
  posts.findOne(req.query.id,(err,row) => {
    if(!err) {
      res.render('home/article', {
        post:row[0]
      })
    }
  })
})
// about
home.get('/about', (req, res) => {
  res.render('home/about', {})
})
module.exports = home;