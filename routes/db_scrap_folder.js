var express = require('express');
var pool = require('../db_pool');
var router = express.Router();
var moment = require('moment');

router.post('/add', function (req, res, next) {
	var memberID = req.body.id;
	var folderName = req.body.folderName;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('INSERT INTO scrap_folder(folderName, memberNum) VALUES(?, ?)', [folderName, memberNum],  function (err) {
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
	var start = Number(req.query.start);
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('SELECT folderName FROM scrap_folder WHERE memberNum=?', [memberNum],  function (err, rows) {
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
		}
	});
});


router.get('/delete', function (req, res, next) {
	var memberID = req.query.id;
	var folderName = req.query.folderName;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('DELETE FROM scrap_folder WHERE memberNum=? AND folderName=?', [memberNum, folderName],  function (err) {
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

router.post('/update', function (req, res, next) {
	var memberID = req.body.id;
	var scrapID = req.body.ScrapID;
	var scrapTitle = req.body.title;
	var scrapContent = req.body.content;
	var folderName = req.body.folderName;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('UPDATE scrap SET scrapTitle=?, scrapContent=?, folderName=? WHERE memberNum=? AND scrapID=?', [scrapTitle, scrapContent, folderName, memberNum, scrapID],  function (err) {
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
