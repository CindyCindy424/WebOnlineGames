# Web课程作业-前端游戏文档

1850477 邓欣凌

TONGJI Univ.

***

##  项目选题

本次项目要求制作一个前端项目，我选择了制作前端游戏，并总共提交以下内容：

​                                  <u>**2个基于three.js的前端游戏** + **1个首页游戏平台**</u>



## 开发工具

- VS Code
- Chrome / Microsoft Edge
- three.js

> **Three.js** 是基于原生WebGL封装运行的三维引擎。
>
> https://threejs.org/
>
> http://www.yanhuangxueyuan.com/Three.js/



## 工程代码

所有项目代码均进行了注释说明，并且将代码分模块整理，尽可能更加简洁、易读。



## 答辩后的改进

项目答辩时，老师针对本项目提出了两个改进意见。答辩结束后，我针对老师的修改意见进行了修改调整。

> 老师的改进意见：
>
> 1）游戏的名字叫“小鸡过马路”，但是游戏里面对于游戏主人公的渲染非常简单，应该制作成一个小鸡形状的主人公。
>
> 2）制作了两个游戏，可以做一个游戏首页平台将两个游戏封装在一起，体现项目的完整性。

1. **将第一个游戏的主人公从一个小方块改成了“小鸡”形状**

   - 修改前：

     <img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200903002535916.png"  style="zoom:50%;" /><br>


   - 修改后：

     <img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200903002605466.png" alt="image-20200903002605466" style="zoom: 33%;" />
     
2. **添加了两个游戏的平台界面作为首页。**

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902221724243.png" alt="image-20200902222016407" style="zoom: 33%;" /><br>


3. **修改了`小球迷宫` 游戏的地图设置，增加了每一关的迷宫难度。**



***



## 项目介绍

本项目共分为三大板块，并已进行**部署**

**部署地址：http://139.224.255.43:9988/**

**图片素材来源：**两个游戏中的主要游戏场景均用three.js 3D引擎绘制，其余图片均为自己制作的图片。



### 首页游戏平台

#### 效果图

![image-20200902222016407](https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902222016407.png)

#### 介绍

本次项目我一共做了两个游戏，所以制作了一个首页对两个游戏进行整合和链接🔗。点击界面上的按钮`GAME 1: 小鸡过马路` 或 `GAME 2：小球迷宫` ， 即可进入对应游戏的开始界面。



### GAME 1：小鸡过马路

部署地址：http://139.224.255.43:9988/cross-the-day-GAME01/index.html

<u>**🚩 由于本项目配置了屏幕点击操控按钮，所以也支持在移动端（如 pad/手机 上进行游戏）**</u>



#### 游戏任务

操纵主人公过马路，不能被路上的车撞到。前进的步数越多分数越多。

#### 主界面介绍

![image-20200902222650564](https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902222650564.png)

***

##### 游戏介绍 Instructions

主界面左上方有本游戏的游戏介绍，并设置有关闭`Instructions`的按钮可以将该界面关掉。若不手动关闭，游戏开始后也会自动隐藏。若隐藏后想再次查看该界面，点击`Help`按钮即可。

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902223334193.png" alt="image-20200902223334193" style="zoom:50%;" />

***

##### 操纵方法

游戏提供两种操控方式：①键盘上的`↑ ↓ ← →`键，②或者是屏幕右下角的点击按钮。同样，该区域也可以**手动关闭**或**重新开启**。

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902223831405.png" alt="image-20200902223831405" style="zoom: 67%;" />

***

##### 关卡设置

游戏设置了`Easy` `Middle` `Hard` 三个难度等级，并以游戏中车辆移动速度的级别区分不同的难度等级。

具体地，设`basicSpeed`为速度基本单位，三个关卡的速度设置如下：

| 关卡   | 车辆行驶速度范围               |
| ------ | ------------------------------ |
| Easy   | 2\*basicSpeed ~ 4\*basicSpeed  |
| Middle | 4\*basicSpeed ~ 7\*basicSpeed  |
| Hard   | 8\*basicSpeed ~ 12\*basicSpeed |

每个关卡中，车辆的具体速度在对应范围内**随机生成**。

在开始界面上可以选择不同的难度等级进行游戏。

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902225249819.png" alt="image-20200902225249819" style="zoom:50%;" />

开始游戏后本轮选择的难度等级会显示在屏幕右上方。

***

##### 游戏分数

本游戏的基本逻辑是需要玩家操纵小鸡🐥过马路，所以前进步数越多，得分越多。分数会和当前关卡难度一起 实时显示在屏幕右上角。

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902225228427.png" alt="image-20200902225228427" style="zoom:33%;" />

***

##### 音效设置

本游戏设置了背景音乐和具体的操作音效。

| 类型     | 内容                      | 完成情况                       |
| -------- | ------------------------- | ------------------------------ |
| 背景音乐 | 贯穿游戏的背景音乐        | 🚩  ✔ （提供背景音乐开关键）    |
| 动作音效 | 点击start键 ---- 开始音效 | 🚩  ✔                           |
|          | 小鸡行走音效              | 🚩  ✔  （每移动一步都触发音效） |
|          | 撞车音效                  | 🚩  ✔                           |
|          | 小鸡被车辆压的音效        | 🚩  ✔  （与撞车音效同时触发）   |

- 背景音乐开关按钮

该按钮位于界面的右下方，玩家可以自行选择开关背景音乐。

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902230215408.png" alt="image-20200902230215408" style="zoom: 67%;" />

***

#### 游戏效果设置

##### 游戏主人公

本游戏是基于three.js的前端游戏，其中游戏主人公`小鸡`是根据抽象动画形象自行绘制的。该主人公在被车辆撞倒后，会触发形变效果，象征游戏结束。

- 游戏主人公

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902230906327.png" alt="image-20200902230906327" style="zoom: 67%;" />

- 被车辆撞击碾压后 （也添加了相应音效）

![image-20200902230949749](https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902230949749.png)

***

##### 游戏场景设置

利用three.js 内置的3d图形绘图接口，绘制了多种游戏元素。

- 在车道上移动的车辆🚗 （不同类型和颜色的车辆）

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902231544007.png" alt="image-20200902231544007" style="zoom: 67%;" />



<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902231629206.png" alt="image-20200902231629206" style="zoom:50%;" />



- 草地 & 树木🌳

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902231737850.png" alt="image-20200902231737850" style="zoom:67%;" />

***



### GAME 2：小球迷宫

部署地址：http://139.224.255.43:9988/maze-GAME02/index.html

**🚩 备注：**

> 本游戏是一开始准备完成本次作业的**练手项目**，通过本项目更熟悉了three.js的使用，以及开发前端游戏的各个环节。但由于一开始游戏设计理念不够灵活，导致本游戏不太具有趣味性，游戏逻辑比较简单，所以又重新写了一个新的游戏——小鸡过马路，并更加注重游戏逻辑的设计和细节的完善。

#### 游戏任务

操纵小球并成功找到迷宫出口。

#### 游戏介绍

![image-20200902232505600](https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902232505600.png)



***

##### Instructions页面

在游戏界面按下`i`键 即可跳出说明界面。

![image-20200902232444992](https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902232339380.png)



***

##### 操纵方法

绑定了`↑ ↓ ← →`  和 `W S A D`， 两种操纵方式均可操纵小球进行前进、后退、左移、右移

<img src="https://github.com/CindyCindy424/WebOnlineGames/blob/main/img/image-20200902232803278.png" alt="image-20200902232803278" style="zoom:50%;" />

***

##### 关卡设定

本游戏采用迷宫生成算法，每一关增加迷宫大小，并随机产生迷宫地图。理论上可以无限增大地图，即可以无限提高关卡。

***

##### 游戏地图生成

为了更灵活的生成游戏地图，设计了下述生成地图的算法。游戏中的迷宫地图均按照该算法<u>随机生成</u>。

```js
function geneMaze(dimension) {
    //生成迷宫
    function iterate(field, x, y) {
        field[x][y] = false;
        while(true) {
            directions = [];
            if(x > 1 && field[x-2][y] == true) {
                directions.push([-1, 0]);
            }
            if(x < field.dimension - 2 && field[x+2][y] == true) {
                directions.push([1, 0]);
            }
            if(y > 1 && field[x][y-2] == true) {
                directions.push([0, -1]);
            }
            if(y < field.dimension - 2 && field[x][y+2] == true) {
                directions.push([0, 1]);
            }
            if(directions.length == 0) {
                return field;
            }
            dir = directions[Math.floor(Math.random()*directions.length)];
            field[x+dir[0]][y+dir[1]] = false;
            field = iterate(field, x+dir[0]*2, y+dir[1]*2);
        }
    }

    // 初始化field
    var field = new Array(dimension);
    field.dimension = dimension;
    for(var i = 0; i < dimension; i++) {
        field[i] = new Array(dimension);
        for (var j = 0; j < dimension; j++) {
            field[i][j] = true;
        }
    }

    field = iterate(field, 1, 1);
    return field;
}
```

***





## 总结

​		本次前端游戏开发是一个全新的任务领域，一开始面对这个作业比较没有头绪，所以首先寻找开源项目学习代码、学习案例，看网络相关教程视频学习游戏引擎three.js的相关操作。慢慢的积累了一些经验。所以前后制作了两个基于three.js的前端小游戏。

​		个人觉得完成本次作业的过程非常有意义。非常锻炼自学能力，同时检验我们对于web基础知识的了解和掌握程度。并且让我更加熟悉从游戏逻辑设计、美工、画面布局设计到代码实现、部署等等的全过程。从而能够更好的独立完成完整项目的开发。

​		同时，为了完善游戏体验，与身边的家人朋友们一起一遍一遍玩儿自己写的小游戏，然后讨论游戏体验，并再次做出改进。这个过程非常的有意思，也很有意义。我非常享受和朋友玩儿`小鸡过马路`并且比较比分的这个过程，并且认为，好的游戏首先要让游戏设计者感到享受。





## 项目结构

```
1850477_邓欣凌_课程项目_前端游戏
│ 
│  index.html
│  
│      
├─cross-the-day-GAME01     //游戏1：小鸡过马路
│  │  index.html
│  │  
│  │      
│  ├─css
│  │      style.css
│  │      
│  ├─js
│  │      jquery.js
│  │      script.js
│  │      three.min.js
│  │      
│  └─res
│      ├─audio
│      │      backg.ogg
│      │      background.mp3
│      │      carexplosion.mp3
│      │      carhit.mp3
│      │      chickendeath.wav
│      │      chickendeath2.wav
│      │      Get Coin 75 wav.wav
│      │      Pop_1.wav
│      │      start.wav
│      │      
│      └─image
│              box.png
│              box2.png
│              box3.png
│              box4.png
│              favicon.ico
│              ins.png
│              
├─homepage  //游戏平台首页
│      footer.css
│      header.css
│      index.css
│      pub.css
│      
├─maze-GAME02  //游戏2：小球迷宫
│  │  index.html
│  │  
│  │      
│  ├─js
│  │      Box2dWeb.min.js
│  │      jquery.js
│  │      keyboard.js
│  │      maze.js
│  │      Three.js
│  │      timer.js
│  │      
│  └─res
│          concrete.png
│          instruction.png
│          notationboard.png
│          style07.png
│          wall10.png
│          
└─res 
        bkg.png
        bkg1.png
        game1.png
        game2.png
        pic1.png
        pic2.png
        pic3.png
        
```

