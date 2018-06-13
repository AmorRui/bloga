const db = require('./db');

// 添加用户
  // INSERT INTO users SET ?  
  exports.addUser = (data,cd) => {
    let query = 'INSERT INTO users SET ?';

    db.query(query,data,(err) => {
      if(!err) {
        // console.log('添加用户成功！');
        return cd(null);
        ;
      }
      return  cd(err);
    })
  }


// 验证用户
exports.auth = function (data,cd) {
  // 根据条件查询数据库
  // 1.
  // SELECT * FROM users WHERE name = 参数
  // 查询结果中包含密码信息

  // 2.
  // 根据参数 判断 密码是否正确

  let query = "SELECT * FROM users WHERE name = ? ";
  db.query(query,[data.name],(err,rows) => {
    if(!err) {
      // console.log(rows);
      if(rows[0].pass == data.pass) {
        return cd(null,rows[0]);
      }
      return cd({msg:'用户名或者密码错误！'});
    }
    cd(err);
  })
}



// 删除用户


// 修改用户

