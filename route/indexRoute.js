var express = require('express');
let indexRoute = express.Router();
var app = express();
let path = require('path');
let myT = require(path.join(__dirname,'../tools/myT'));
// var template = require('art-template');



indexRoute.get('/',(req,res)=>{
    if (req.session.userInfo) {
        let userName= req.session.userInfo.userName;
         res.render(path.resolve(__dirname, '../static/views/index.html'), {
                     userName
        });
        // var html = template(__dirname, '../static/views/index.html', {
        //     userName
        // });
    } else {
        res.setHeader('content-type', 'text/html');
        res.send("<script>alert('请先登录');window.location.href='/login'</script>")
    }
})
module.exports = indexRoute;