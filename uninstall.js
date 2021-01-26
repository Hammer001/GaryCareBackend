let Service = require('node-windows').Service;
let svc = new Service({
    name: 'garycare.node.server',    //服务名称
    description: 'GaryCare后端服务器', //描述
    script: require('path').join(__dirname,'server.js') //nodejs项目要启动的文件路径
});
svc.on('uninstall', function () {
    console.log('Uninstall Complete.');
    console.log('The service exists: ', svc.exists);
});
svc.uninstall();