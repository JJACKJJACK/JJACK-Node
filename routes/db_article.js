var express = require('express');
var pool = require('../db_pool');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next) {
	var startIndex = Number(req.query.start)
	pool.query('SELECT * FROM article ORDER BY submitDate desc LIMIT ?, 10', [startIndex],  function (err, rows) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			if(rows.length != 0) {
				for (var i=0; i<rows.length; i++) {
					rows[i].submitDate = moment(rows[i].submitDate).format('YYYY-MM-DD HH:mm:ss');
				}
			}
			res.json({
				code: 1,
				message: '',
				result: rows
			});
		}
	});
});

module.exports = router;
