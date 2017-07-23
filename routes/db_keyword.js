var express = require('express');
var pool = require('../db_pool');
var router = express.Router();

router.get('/ranking', function (req, res, next) {
	pool.query('SELECT keywordName, count, @SEQ := @SEQ + 1 AS ranking FROM (SELECT keywordName AS keywordName, count(*) AS count FROM keyword GROUP BY keywordName ORDER BY count DESC) A, (SELECT @SEQ := 0) B LIMIT 0, 20', [],  function (err, rows) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			if (rows.length != 0) {
				res.json({
					code: 1,
					message: '',
					result: rows
				});
			}
		}
	});
});

router.post('/add', function (req, res, next) {
	var memberID = req.body.id;
	var keywordName = req.body.keyword;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('INSERT INTO keyword(keywordName, memberNum) VALUES(?,?)', [keywordName, memberNum],  function (err) {
				if (err) {
					res.json({
						code: -1,
						message: err
					});
				} else {
					res.json({
						code: 1,
						message: '',
					});
				}
			});
		}
	});
});

router.get('/list', function (req, res, next) {
	var memberID = req.query.id;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('SELECT keywordName FROM keyword WHERE memberNum=?', [memberNum],  function (err, rows) {
				if (err) {
					res.json({
						code: -1,
						message: err
					});
				} else {
					res.json({
						code: 1,
						message: '',
						keywords: rows
					});
				}
			});
		}
	});
});

router.get('/delete', function (req, res, next) {
	var memberID = req.query.id;
	var keywordName = req.query.keyword;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('DELETE FROM keyword WHERE memberNum=? AND keywordName=?', [memberNum, keywordName],  function (err) {
				if (err) {
					res.json({
						code: -1,
						message: err
					});
				} else {
					res.json({
						code: 1,
						message: '',
					});
				}
			});
		}
	});
});

module.exports = router;
