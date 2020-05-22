const {createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/app/',createProxyMiddleware(
        {
            target: 'http://www.365tc.cn:9000',// 后端服务器地址
            changeOrigin: true,
            secure: false
        }
    ));
}