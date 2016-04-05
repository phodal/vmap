# V Map

##Architecture

![V Map Architecture](vmap-arch.png)

###Sub-Module

 - [bang](https://github.com/phodal/vmap-bang): the Detail Page generator of V Map
 - [bot](https://github.com/phodal/vmap-bot): Index Data to ElasticSearch
 - [fang](https://github.com/phodal/vmap-fang): Data Mining of V Map
 - [four](https://github.com/phodal/vmap-four): The Data Crawl of V Map
 - [xunv](https://github.com/phodal/xunv): Search Result Page of V Map

###Tech Stack

 - Leaflet
 - Bootstrap
 - ElasticSearch
 - jQuery


###添加新用户

修改用户数据文件 ``/static/js/v_data.js``

格式: 
```
{
    name: {用户名},
    latLang: [{经度}, {纬度}]
}
```

ps: 经纬度可以由Google Map搜索地址获得.

如

```
{
    name: "Phodal",
    latLang: [34.2173804, 108.8981328]
}
```

**欢迎关注我的微信公众号: phodal**

![QRCode](static/images/wechat.jpg)

##截图

![Screen Shot](vmap.jpg)

License
---

© 2016 A [Phodal Huang](https://www.phodal.com)'s [Idea](http://github.com/phodal/ideas). This code is distributed under the MIT license. See `LICENSE` in this directory.

[待我代码编成，娶你为妻可好](http://www.xuntayizhan.com/person/ji-ke-ai-qing-zhi-er-shi-dai-wo-dai-ma-bian-cheng-qu-ni-wei-qi-ke-hao-wan/) @ [花仲马](https://github.com/hug8217)
