var Care = require('./models/care');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

function getAllData(res) {
	Care.find(function (err, todos) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
			res.send(err);
		}

		res.json(todos); // return all todos in JSON format
	});
}

function getSingleItemData(req, res, type) {
	const Id = req.body['_id'] || null;
	if (Id) {
		Care.findOne({ _id: Id }, function (err, doc) {
			if (err) {
				res.send(err);
			} else {
				const date = req.body.date;
				let dataIndex = _.findIndex(doc.data, (o) => {
					return o.date === date;
				});
				if (doc.data && _.isArray(doc.data)) {
					if (dataIndex !== -1 && _.isArray(doc.data[dataIndex][type])) {
						res.send({
							msg: '查询完毕！',
							success: true,
							callback: doc.data[dataIndex][type],
						});
					} else {
						res.send({
							msg: '查询完毕！',
							success: true,
							callback: { [type]: null },
						});
					}
				} else {
					res.send({
						msg: '查询完毕！',
						success: true,
						callback: { data: null },
					});
				}
			}
		});
	}
}

module.exports = function (app) {
	// api ---------------------------------------------------------------------
	// get all todos

	app.get('/getAll', function (req, res) {
		// use mongoose to get all todos in the database
		getAllData(res);
	});

	app.post('/findPhone', function (req, res) {
		Care.findOne({ phone: req.body['phone'] }, function (err, doc) {
			if (!doc) {
				res.send({
					msg: '手机号可用',
					usable: true,
				});
			} else {
				res.send({
					msg: '手机已被注册',
					code: 'phone-registered',
					_id: doc._id,
					usable: false,
				});
			}
		});
	});
	app.post('/signin', function (req, res) {
		Care.findById(req.body['_id'], function (err, doc) {
			if (err) {
				res.status(400).send(err);
			} else {
				if (doc && req.body['pass'] === doc.pass) {
					res.status(200).send(doc);
				} else {
					res.status(401).send({
						msg: '密码错误',
						code: 'wrong-password',
						error: true,
					});
				}
			}
		});
	});
	app.post('/signup', function (req, res) {
		Care.findOne({ phone: req.body['phone'] }, function (err, doc) {
			if (!doc) {
				let newId = uuidv4();
				new Care({
					_id: newId,
					phone: req.body['phone'],
					pass: req.body['pass'],
				}).save(function (err, doc) {
					if (err) {
						res.send(err);
					} else {
						res.send(doc);
					}
				});
			} else {
				res.send({
					msg: '手机已被注册',
					code: 'phone-registered',
					error: true,
				});
			}
		});
	});

	app.post('/update/user/data', function (req, res) {
		Care.findOne({ _id: req.body['_id'] }, function (err, doc) {
			if (err) {
				res.send(err);
			} else {
				if (req.body['data']) {
					doc.data = req.body['data'];
					doc.save();
					res.send({
						msg: '更新成功',
						callback: doc,
					});
				}
			}
		});
	});

	app.post('/get/user/data', function (req, res) {
		if (req.body['_id']) {
			Care.findOne({ _id: req.body['_id'] }, function (err, doc) {
				if (err) {
					res.send(err);
				} else {
					res.send({
						msg: '获取成功！',
						sucess: true,
						callback: doc,
					});
				}
			});
		} else {
			res.send({
				msg: '没有_id值!',
				error: true,
			});
		}
	});

	app.post('/update/user/phone', function (req, res) {
		Care.findOne({ _id: req.body['_id'] }, function (err, doc) {
			if (err) {
				res.send(err);
			} else {
				doc.phone = req.body['phone'];
				doc.save();
				res.send({
					msg: '更新成功',
					callback: doc,
				});
			}
		});
	});
	/**
	 * 单独添加各项数据
	 */
	app.post('/get/feed', function (req, res) {
		getSingleItemData(req, res, 'feed');
	});
	app.post('/get/poo', function (req, res) {
		getSingleItemData(req, res, 'poo');
	});
	app.post('/get/sleep', function (req, res) {
		getSingleItemData(req, res, 'sleep');
	});
	app.post('/get/temperture', function (req, res) {
		getSingleItemData(req, res, 'temperture');
	});
	app.post('/get/note', function (req, res) {
		getSingleItemData(req, res, 'note');
	});

	app.delete('/remove/test', function (req, res) {
		Care.deleteMany({ phone: '18606201441' }, function (err, doc) {
			if (err) {
				res.send(err);
			} else {
				res.send(doc);
				// doc.forEach(function (item, index, arr) {
				// 	item.remove(function (err, doc) {
				// 		console.log(doc);
				// 	});
				// });
			}
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function (req, res) {
		res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
