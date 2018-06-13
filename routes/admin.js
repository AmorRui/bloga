const express = require('express');
// 处理文件
const path = require('path');
// 处理数据的用户模型
const users = require('../models/users');
const posts = require('../models/posts');
// 文件上传
const multer = require('multer');
// 上传☞文件路径
// let upload = multer({dest: 'uploads/'});
let storage = multer.diskStorage({
  // 自定义存储位置
  destination: function (req, file, cb) {
    let root = path.join(__dirname, "..")
    cb(null, path.join(root, 'public/uploads'))
  },
  // 自定义文件名称
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, file.fieldname + '_' + Date.now() + ext);
  }
});

let upload = multer({
  storage: storage
});

// 路由
const admin = express.Router();

// 后台首页
admin.get('/', (req, res) => {

  // console.log(req.session);

  res.render("admin/index", {})
});
// 跳转个人中心
admin.get('/personal', (req, res) => {
  res.render("admin/personal", {})
})

// 接收上传的文件
admin.post('/profile', upload.single('avatar'), function (req, res, next) {
  // console.log(req.file)
  res.json({
    code: 10000,
    path: path.join('uploads', req.file.filename)
  })
})

// 文章管理（添加页面）
admin.get('/add', (req, res) => {

  res.render('admin/index'
    // , {action: '/admin/add' }
  );
})
// 文章管理（列表页面）
admin.get('/list', (req, res) => {

  // 调用模型取数据
  // 获得页码
  let page = req.query.page || 1;
  // 每页数据条数
  let size = req.query.size || 7;

  // 
  posts.find(page, size, (err, rows) => {
    // console.log(rows);

    posts.count((err, row) => {
      console.log(row);

      if (!err) {
        res.render('admin/list', {
          posts: rows,
          page: page,
          total: Math.ceil(row.total / size)
        });
      }
    })
  });
});

// 删除文章
admin.get('/delete', (req, res) => {
  posts.deleteById(req.query.id, (err) => {
    if (!err) {
      res.json({
        code: 10000,
        msg: "删除成功"
      })
    }
  })
})
// 添加文章
admin.post('/add', (req, res) => {
  req.body.uid = req.session.loginfo.id;
  req.body.time = new Date;
  posts.addPost(req.body, (err) => {
    if (!err) {
      res.json({
        code: 10000,
        msg: '添加成功'
      })
    }
  })
})
// 编辑文章
admin.get('/edit', (req, res) => {
  posts.findOne(req.query.id, (err, rows) => {
    // console.log(rows)
    if (!err) {
      res.render('admin/exit', {
        post: rows[0]
        // action: '/admin/update'
      });
    }
  })
})
// 更新文章
admin.post('/update', (req, res) => {
  console.log(req.body);
  posts.update(req.body, (err) => {
    if (!err) {
      res.json({
        code: 10000,
        msg: '修改成功'
      });
    }
  })
})
module.exports = admin;