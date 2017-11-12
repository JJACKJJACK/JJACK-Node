var express = require('express');
var pool = require('../db_pool');
var router = express.Router();

router.get('/recent', function (req, res, next) {
	var keywordName = req.query.keyword
	pool.query("SELECT date_format(searchDate, '%Y-%m-%d') AS date, count(*) AS hits FROM keyword_log WHERE keywordName=? AND searchDate >= date_add(now(), interval -7 day) AND searchDate <= now() GROUP BY date ORDER BY date DESC", [keywordName],  function (err, rows) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			res.json({
				code: 1,
				message: '',
				result: rows
			});
		}
	});
});
/*
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
*/

module.exports = router;
