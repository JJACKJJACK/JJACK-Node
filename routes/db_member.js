var express = require('express');
var pool = require('../db_pool');
var router = express.Router();
var moment = require('moment');

router.post('/insert', function(req, res, next) {
	var memberID = req.body.id;
	var year = req.body.year;
	var gender = req.body.gender;
	pool.query('INSERT INTO member(memberID, year, gender) VALUES(?, ?, ?)', [memberID, year, gender],  function (err) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			res.json({
				code: 1,
				message: ''
			});
		}
	});
});


router.get('/select', function(req, res, next) {
	var memberID = req.query.id;
	pool.query('SELECT * FROM member WHERE memberID=?', [memberID],  function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			if (row.length != 0) { 
				row[0].registerDate = moment(row[0].registerDate).format('YYYY-MM-DD HH:mm:ss');
				row[0].modifyDate = moment(row[0].modifyDate).format('YYYY-MM-DD HH:mm:ss');
			}
			res.json({
				code: 1,
				message: '',
				result: row
			});
		}
	});
});

module.exports = router;
