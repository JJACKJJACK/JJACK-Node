var express = require('express');
var pool = require('../db_pool');
var router = express.Router();
var moment = require('moment');

router.post('/add', function (req, res, next) {
	var memberID = req.body.id;
	var articleID = req.body.articleID;
	var scrapTitle = req.body.title;
	var scrapContent = req.body.content;
	var folderID = req.body.folderID;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('INSERT INTO scrap(memberNum, articleID, scrapTitle, scrapContent, folderID) VALUES(?, ?, ?, ?, ?)', [memberNum, articleID, scrapTitle, scrapContent, folderID],  function (err) {
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
	var folderName = req.query.folderName;
	var start = Number(req.query.start);
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else if (row.length == 0) {
			res.json({
				code: -1,
				message: "Empty result"
			});
		} else {
			var memberNum = row[0].memberNum;
			if (folderName == '전체') {
				pool.query('SELECT A.articleID, A.articleTitle, A.articleURL, A.image, B.scrapDate, B.scrapTitle, B.scrapContent, C.folderName, B.scrapID FROM article AS A INNER JOIN scrap AS B ON A.articleID=B.articleID INNER JOIN scrap_folder AS C ON B.folderID=C.folderID WHERE B.memberNum=? LIMIT ?,10', [memberNum, start],  function (err, rows) {
					if (err) {
						res.json({
							code: -1,
							message: err
						});
					} else {
						var length = rows.length;
						for (var i=0; i<length; i++) {
							rows[i].scrapDate = moment(rows[i].scrapDate).format('YYYY-MM-DD HH:mm:ss');
						}
						res.json({
							code: 1,
							message: '',
							result: rows
						});
					}
				});
			} else {
				pool.query('SELECT folderID FROM scrap_folder where folderName=? AND memberNum=?', [folderName, memberNum], function (err, row) {
					if (err) {
						res.json({
							code: -1,
							message: err
						});
					} else {
						var folderID = row[0].folderID;
						pool.query('SELECT A.articleID, A.articleTitle, A.articleURL, A.image, B.scrapDate, B.scrapTitle, B.scrapContent, C.folderName, B.scrapID FROM article AS A INNER JOIN scrap AS B ON A.articleID=B.articleID INNER JOIN scrap_folder AS C ON B.folderID=C.folderID WHERE B.memberNum=? AND folderID=? LIMIT ?,10', [memberNum, folderID, start],  function (err, rows) {
							if (err) {
								res.json({
									code: -1,
									message: err
								});
							} else {
								var length = rows.length;
								for (var i=0; i<length; i++) {
									rows[i].scrapDate = moment(rows[i].scrapDate).format('YYYY-MM-DD HH:mm:ss');
								}
								res.json({
									code: 1,
									message: '',
									result: rows
								});
							}
				
						});
					}
				});
			}
		}
	});
});



router.get('/delete', function (req, res, next) {
	var memberID = req.query.id;
	var scrapID = req.query.ScrapID;
	pool.query('SELECT memberNum FROM member WHERE memberID=?', [memberID], function (err, row) {
		if (err) {
			res.json({
				code: -1,
				message: err
			});
		} else {
			var memberNum = row[0].memberNum;
			pool.query('DELETE FROM scrap WHERE memberNum=? AND scrapID=?', [memberNum, scrapID],  function (err) {
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
