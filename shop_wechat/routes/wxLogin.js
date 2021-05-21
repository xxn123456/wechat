const Router = require('koa-router');
const router = new Router({prefix: '/wx'});
const axios = require('axios')
const AppId = 'wx12c3a13ca405fd31';
const appSecret = '694756606756a860ad7c2bf9ae25bdf3';



router.get('/wechat_login',async function(ctx,next){

    let code = ctx.query.code;

    let {data} = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${AppId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`);


    ctx.response.status = 200;
    ctx.body = {
        code: -1,
        desc: '参数不齐全',
        data
    }



    
    

});

router.get('/get_wx_access_token', function(req,res, next){
    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get(
        {   
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
        },
        function(error, response, body){
            if(response.statusCode == 200){
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                var data = JSON.parse(body);
                var access_token = data.access_token;
                var openid = data.openid;
                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                    },
                    function(error, response, body){
                        if(response.statusCode == 200){
                            // 第四步：根据获取的用户信息进行对应操作
                            var userinfo = JSON.parse(body);
                            console.log('获取微信信息成功！');
                            //其实，到这就写完了，你应该拿到微信信息以后去干该干的事情，比如对比数据库该用户有没有关联过你们的数据库，如果没有就让用户关联....等等等...
                            // 小测试，实际应用中，可以由此创建一个帐户
                            res.send("\
                                <h1>"+userinfo.nickname+" 的个人信息</h1>\
                                <p><img src='"+userinfo.headimgurl+"' /></p>\
                                <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                                <p>openid: "+userinfo.openid+"</p>\
                            ");
                        }else{
                            console.log(response.statusCode);
                        }
                    }
                );
            }else{
                console.log(response.statusCode);
            }
        }
    );
})



module.exports = router


