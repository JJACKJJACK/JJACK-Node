var express = require('express');
var pool = require('../db_pool');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next) {
	var startIndex = Number(req.query.start)
	pool.query('SELECT articleID, articleTitle, articleURL, image FROM article ORDER BY submitDate desc LIMIT ?, 10', [startIndex],  function (err, rows) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
		//	if(rows.length != 0) {
		//		for (var i=0; i<rows.length; i++) {
		//			rows[i].submitDate = moment(rows[i].submitDate).format('YYYY-MM-DD HH:mm:ss');
		//		}
		//	}
			res.json({
				code: 1,
				message: '',
				result: rows
			});
		}
	});
});

router.get('/get', function(req, res, next) {
	var id = Number(req.query.id)
	pool.query('SELECT * FROM article WHERE articleID=?', [id],  function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			if(row.length != 0) {
				row[0].submitDate = moment(row[0].submitDate).format('YYYY-MM-DD HH:mm:ss');
			} 
			res.json({
				code: 1,
				message: '',
				result: row
			});
		}
	});
});

router.get('/keyword', function(req, res, next) {
	var keyword = req.query.keyword;
	var start = Number(req.query.start);
	pool.query("SELECT articleID, articleTitle, articleURL, image FROM article WHERE articleTitle LIKE '%" + keyword + "%' limit ?, 10", [start],  function (err, rows) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var length = rows.length;
			for (var i=0; i<length; i++) {
				rows[i].submitDate = moment(rows[i].submitDate).format('YYYY-MM-DD HH:mm:ss');
			}
			res.json({
				code: 1,
				message: '',
				result: rows
			});
		}
	});
});


/*
router.get('/keyword', function(req, res, next) {
	var keyword = req.query.keyword;
	var sql = "SELECT articleID FROM article_index WHERE articleTitle LIKE '%" + keyword + "%'";
	pool.query(sql, [keyword],  function (err, idRows) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var articleArray = [];
			var idRowsLength = idRows.length;
			for (var i=0; i<idRowsLength; i++) {
				var articleID = idRows[i].articleID;
				pool.query('SELECT * FROM article WHERE articleID=?', [articleID], function (err, row) {
					if (err) {
						res.json({
							code: -1,
							message: err
						});
					} else {
						row[0].submitDate = moment(row[0].submitDate).format('YYYY-MM-DD HH:mm:ss');
						articleArray.push(row[0]);
					}
				});
			}
			res.json({
				code: 1,
				message: '',
				result: articleArray
			});
		}
	});
});
*/


module.exports = router;
