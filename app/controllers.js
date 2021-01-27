var Care = require('./models/care');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

class Controllers {
	async findPhone(req, res) {
		try {
			const reqPhone = _.get(req, 'body.phone', null);
			if (!reqPhone) {
				res.status(404).send({
					msg: '手机号数据错误！',
					error: true,
				});
			} else {
				const userPhone = await Care.findOne({ phone: reqPhone });
				if (!userPhone) {
					res.send({
						msg: '手机号可用',
						usable: true,
					});
				} else {
					res.send({
						msg: '手机号已注册！',
						_id: _.get(userPhone, '_id', null),
						usable: false,
					});
				}
			}
		} catch (error) {
			if (error.name === 'CastError' || error.name === 'NotFoundError') {
				res.send(404);
			}
			res.send(error);
		}
	}

	async signIn(req, res) {
		try {
			const reqId = _.get(req, 'body._id', null);
			if (!reqId) {
				res.status(404).send({
					msg: '没有id值',
					error: true,
				});
			} else {
				const userSignIn = await Care.findById(reqId);
				if (userSignIn && req.body['pass'] === userSignIn.pass) {
					res.status(200).send(userSignIn);
				} else {
					res.status(401).send({
						msg: '密码错误',
						code: 'wrong-password',
						error: true,
					});
				}
			}
		} catch (error) {
			if (error.name === 'CastError' || error.name === 'NotFoundError') {
				res.send(404);
			}
			res.send(error);
		}
	}

	async signUp(req, res) {
		try {
			const reqPhone = _.get(req, 'body.phone', null);
			if (!reqPhone) {
				res.status(404).send({
					msg: '未找到手机号！',
					error: true,
				});
			} else {
				const findUserPhone = await Care.findOne({ phone: reqPhone });
				if (!findUserPhone) {
					let newId = uuidv4();
					let newUser = new Care({
						_id: newId,
						phone: req.body['phone'],
						pass: req.body['pass'],
						data: [],
					}).save();
					res.send(newUser);
				} else {
					res.send({
						msg: '手机已被注册',
						code: 'phone-registered',
						error: true,
					});
				}
			}
		} catch (error) {
			if (error.name === 'CastError' || error.name === 'NotFoundError') {
				res.send(404);
			}
			res.send(error);
		}
    }
    
	async updateUserData(req, res) {
		try {
            const reqId = _.get(req, 'body._id', null);
            const reqData = _.get(req, 'body.data', null);
			if (!reqId) {
				res.status(404).send({
					msg: '未检测到_id',
					error: true,
				});
			} else {
				const findUserData = await Care.findOne({ _id: reqId });
				if (!findUserData) {
                    res.send({
                        msg: '未检测到用户数据',
                        error: true,
                    });
				} else {
                    if(reqData){
                        findUserData.data = reqData;
                        findUserData.save();
                        res.send({
                            msg: '更新成功',
                            callback: findUserData,
                        });
                    }
				}
			}
		} catch (error) {
			if (error.name === 'CastError' || error.name === 'NotFoundError') {
				res.send(404);
			}
			res.send(error);
		}
    }
    
	async getUserData(req, res) {
		try {
            const reqId = _.get(req, 'body._id', null);
			if (!reqId) {
				res.status(404).send({
					msg: '未检测到_id',
					error: true,
				});
			} else {
				const findUserData = await Care.findOne({ _id: reqId });
				if (!findUserData) {
                    res.send({
                        msg: '未检测到用户数据',
                        error: true,
                    });
				} else {
                    res.send({
                        msg: '获取成功！',
						sucess: true,
                        callback: findUserData,
                    });
				}
			}
		} catch (error) {
			if (error.name === 'CastError' || error.name === 'NotFoundError') {
				res.send(404);
			}
			res.send(error);
		}
	}
}

module.exports = new Controllers();
