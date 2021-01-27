var Care = require('./models/care');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const Controllers = require('./controllers');

function getAllData(res) {
	Care.find(function (err, todos) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
			res.send(err);
		}

		res.json(todos); // return all todos in JSON format
	});
}

module.exports = function (app) {
	// api ---------------------------------------------------------------------
	// get all todos

	app.get('/getAll', function (req, res) {
		// use mongoose to get all todos in the database
		getAllData(res);
	});

    //正式小程序使用接口
	app.post('/findPhone', Controllers.findPhone);

	app.post('/signin', Controllers.signIn);

	app.post('/signup', Controllers.signUp);

	app.post('/update/user/data', Controllers.updateUserData);

	app.post('/get/user/data', Controllers.getUserData);

      //测试或临时使用接口
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
