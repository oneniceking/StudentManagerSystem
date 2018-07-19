let express = require('express');
let app = express();
let path = require('path');
let svgCaptcha = require('svg-captcha');
let session = require('express-session');
let bodyParser = require('body-parser');
let myT = require(path.join(__dirname, 'tools/myT'));
let indexRoute = require(path.join(__dirname, '/route/indexRoute'));
app.use(express.static('static'));
app.use(session({
    secret: 'keyboard cat'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
// 使用 index路由中间件 挂载到 /index这个路径下面
app.use('/index', indexRoute);
//模板
app.engine('html', require('express-art-template'));
app.set('views', '../static/views');
//路由1
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/views/login.html'))
})
//路由2
app.post('/login', (req, res) => {
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    // console.log(userName);
    // console.log(userPass);
    let code = req.body.code;

    if (code == req.session.captcha) {
        myT.find('study',{userName,userPass},(err,docs)=>{
            if(!err){
                if(docs.length==1){
                    req.session.userInfo={
                        userName
                    }
                    res.redirect("/index");
                } else {
                    myT.mess(res, '账号或密码错误', '/login')
                }
            }
        })
    } else {
        myT.mess(res,'验证码不对','/login')
    }

})
//路由3
app.get('/login/captchaImg', (req, res) => {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text.toLocaleLowerCase();
    // console.log(req.session);

    // console.log(captcha.text);
    res.type('svg');
    res.status(200).send(captcha.data);
})

//路由四

//路由五
app.get('/logout', (req, res) => {
    delete req.session.userInfo;
    res.redirect('/login');
});
//路由6
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/views/register.html'));
});
//路由7
app.post('/register', (req, res) => {
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    myT.find('study', {
        userName
    }, (err, docs) => {
        if (docs.length == 0) {
            myT.insert('study', {
                userName,
                userPass
            }, (err, result) => {
                if (!err) {
                    myT.mess(res, '欢迎加入', '/login');
                }
            })
        } else {
            myT.mess(res, '很遗憾已被使用', '/register');
        }
    })
})

app.listen(88, '127.0.0.1', () => {
    console.log('success');

});