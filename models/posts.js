const db = require('./db');

exports.add = function () {

}

exports.find = function (page, size, cb) {

	// SELECT * FROM posts;
	// let query = 'SELECT * FROM posts';
	
	let offset = (page - 1) * size;
	let query = 'SELECT p.id, p.title, p.brief, p.time, u.name, u.avatar FROM posts AS p LEFT JOIN users AS u ON p.uid = u.id LIMIT ?, ?'

	db.query(query, [offset, size], (err, rows) => {
		if(!err) {
			// 调用回调
			return cb(null, rows);
		}
		cb(err);
	})
}

exports.deleteById = function (id,cb) {
  // DELETE FROM posts WHERE id = ?
  let query = 'DELETE FROM posts WHERE id = ?';
  db.query(query,id,(err) => {
    if(!err) {
      return cb(null);
    }
    cb(err)
  })
}

exports.addPost = function (data, cb) {
  // 'INSERT INTO posts SET ?'
	let query = 'INSERT INTO posts SET ?';
	db.query(query, data, (err) => {
		if(!err) {
			return cb(null);
		}
		cb(err);
	})
}

// 编辑
// exports.findOne = function (id,cb) {
//   let query = "SELECT * FROM posts WHERE id = ? ";
//   db.query(query,id,(err,rows) => {
//     if(!err) {
//       return cb(null,rows);
//     }
//     cb(err);
//   })
// }

exports.findOne = function (id, cb) {
	let query = "SELECT * FROM posts AS p LEFT JOIN users AS u ON p.uid = u.id WHERE p.id = ?";
	db.query(query, id, (err, rows) => {
		if(!err) {
			return cb(null, rows);
		}
		cb(err);
	})
}
exports.update = function (data, cb) {

	let query = 'UPDATE posts SET ? WHERE id = ?';
	// 主键
	let id = data.id;
	// 删除主键
  delete data.id;
  
	db.query(query, [data, id], (err) => {
		if(!err) {
			return cb(null);
		}
		cb(err);
	})
}

exports.count = function (cb) {

	let query = 'SELECT count(*) as total FROM posts;';

	db.query(query, (err, rows) => {
		if(!err) {
			return cb(null, rows[0]);
		}

		cb(err);
	})
}
