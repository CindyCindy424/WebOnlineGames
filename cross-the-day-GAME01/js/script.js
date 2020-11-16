/*---- 1850477 邓欣凌 ----*/
/*------ Tongji SSE -----*/
/*----- Web课程项目 -----*/

const counterDOM = document.getElementById('counter');  
const endDOM = document.getElementById('end');
const closeBTN = document.getElementById('close-ins');
const ins = document.getElementById('instructions');
const helpBTN = document.getElementById('help-btn');
const easyBTN = document.getElementById('easy');
const middleBTN = document.getElementById('middle');
const hardBTN = document.getElementById('hard');

const scene = new THREE.Scene();//创建场景

const distance = 500;
const camera = new THREE.OrthographicCamera( window.innerWidth/-2, window.innerWidth/2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000 );

//设置camera旋转角度
camera.rotation.x = 50*Math.PI/180;
camera.rotation.y = 20*Math.PI/180;
camera.rotation.z = 10*Math.PI/180;
const initialCameraPositionY = -Math.tan(camera.rotation.x)*distance + 150;
const initialCameraPositionX = Math.tan(camera.rotation.y)*Math.sqrt(distance**2 + initialCameraPositionY**2);
camera.position.y = initialCameraPositionY;
camera.position.x = initialCameraPositionX;
camera.position.z = distance+50;

//绘制素材的大小基数，方便调整
const zoom = 2;

//小鸡的大小
const chickenSize = 15;

//游戏主界面显示设置
const positionWidth = 50;
const columns = 18;
const boardWidth = positionWidth*columns;

//主人公每跳一下的时间(ms)
const stepTime = 200; 

let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;

var scores;

//游戏结束flag
var gameOver = true; 

//难度关卡
var level=["Easy","Middle","Hard"];
var currLevel = level[0];

/*--------- 选择关卡难度 ---------*/
document.querySelector('#easy').addEventListener("click", () => {
  easyBTN.style.boxShadow = "10px 10px 5px #888888";
  middleBTN.style.boxShadow = "3px 3px 2px #888888";
  hardBTN.style.boxShadow = "3px 3px 2px #888888";
  
  currLevel = level[0];
  document.getElementById('show-level').innerHTML = level[0];
});
document.querySelector('#middle').addEventListener("click", () => {
  middleBTN.style.boxShadow = "10px 10px 5px #888888";
  easyBTN.style.boxShadow = "3px 3px 2px #888888";
  hardBTN.style.boxShadow = "3px 3px 2px #888888";
  
  currLevel = level[1];
  document.getElementById('show-level').innerHTML = level[1];
});
document.querySelector('#hard').addEventListener("click", () => {
  console.log("hard 点击");
  hardBTN.style.boxShadow = "10px 10px 5px #888888";
  easyBTN.style.boxShadow = "3px 3px 2px #888888";
  middleBTN.style.boxShadow = "3px 3px 2px #888888";
  
  currLevel = level[2];
  document.getElementById('show-level').innerHTML = level[2];
});

document.querySelector('#start').addEventListener("click", () => {
  document.getElementById('start-music').play();
  gameOver = false;
  hardBTN.style.visibility = 'hidden';
  easyBTN.style.visibility = 'hidden';
  middleBTN.style.visibility = 'hidden';
  endDOM.style.visibility = 'hidden';
  document.getElementById('score').style.visibility='hidden';

  lanes.forEach(lane => scene.remove( lane.mesh ));
  initialiseValues(); //重新初始化
  gameOver = false;
  
  document.getElementById('logo').style.visibility = 'hidden';
  document.getElementById('start').style.visibility = 'hidden';
  document.getElementById('instructions').style.visibility = 'hidden';
  document.getElementById('close-ins').style.visibility = 'hidden';
  document.getElementById('close').style.visibility = 'hidden';
  document.getElementById('help-btn').style.visibility = 'visible';
  document.getElementById('counter').innerHTML = 'Scores: 0' ;
});


/*-------- 设置提示按钮逻辑 ------*/
document.querySelector("#close-ins").addEventListener("click", () => {
  closeBTN.style.visibility = 'hidden';
  ins.style.visibility = 'hidden';
  helpBTN.style.visibility = 'visible';
});
document.querySelector('#help-btn').addEventListener("click",() => {
  closeBTN.style.visibility = 'visible';
  ins.style.visibility = 'visible';
  helpBTN.style.visibility = 'hidden';
});

/*------- 设置屏幕键盘开关 -------*/
document.querySelector('#close-keyboard').addEventListener("click", () => {
  document.getElementById("close-keyboard").style.visibility = 'hidden';
  document.getElementById("box").style.visibility = 'hidden';
  document.getElementById("controls").style.visibility = 'hidden';
  document.getElementById("keyboard").style.visibility = 'visible';
});
document.querySelector('#keyboard').addEventListener("click",() => {
  document.getElementById("close-keyboard").style.visibility = 'visible';
  document.getElementById("box").style.visibility = 'visible';
  document.getElementById("controls").style.visibility = 'visible';
  document.getElementById("keyboard").style.visibility = 'hidden';
});

/*------- 设置背景音乐开关 -------*/
document.querySelector('#music-on').addEventListener("click", () => {
  //console.log("想要关闭音乐，此时状态：" + document.getElementById("bkg").ended);
  let x = document.getElementById("bkg");
  if(x.played.end(0)===0){
    x.play();
  }
  else{
    document.getElementById("bkg").muted=true;
    document.getElementById("music-on").style.visibility='hidden';
    document.getElementById("music-close").style.visibility='visible';
  }
  
  //console.log("已经关闭音乐，此时状态："+document.getElementById("bkg").paused);
});
document.querySelector('#music-close').addEventListener("click", () => {
  document.getElementById("bkg").muted=false;
  document.getElementById('bkg').volume = 0.5;
  document.getElementById("music-close").style.visibility='hidden';
  document.getElementById("music-on").style.visibility='visible';
});

/*------ 屏幕大小重适应 ------*/
function onResize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  //camera.aspect = (window.innerWidth-4)/(window.innerHeight-);
  camera.updateProjectionMatrix(); //更新相机数据
}

// 设置resize 事件处理
$(window).resize(onResize);



/*-----利用自定义函数Texture(内封装图片素材绘制)绘制车辆------*/
//小车
const carFrontTexture = new Texture(40,80,[{x: 0, y: 10, w: 30, h: 60 }]);
const carBackTexture = new Texture(40,80,[{x: 10, y: 10, w: 30, h: 60 }]);
const carRightSideTexture = new Texture(110,40,[{x: 10, y: 0, w: 50, h: 30 }, {x: 70, y: 0, w: 30, h: 30 }]);
const carLeftSideTexture = new Texture(110,40,[{x: 10, y: 10, w: 50, h: 30 }, {x: 70, y: 10, w: 30, h: 30 }]);
//卡车
const truckFrontTexture = new Texture(30,30,[{x: 15, y: 0, w: 10, h: 30 }]);
const truckRightSideTexture = new Texture(25,30,[{x: 0, y: 15, w: 10, h: 10 }]);
const truckLeftSideTexture = new Texture(25,30,[{x: 0, y: 5, w: 10, h: 10 }]);

const generateLanes = () => [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,-15].map((index) => {
  const lane = new Lane(index);
  lane.mesh.position.y = index*positionWidth*zoom;
  scene.add( lane.mesh );
  return lane;
}).filter((lane) => lane.index >= 0);

const addLane = () => {
  const index = lanes.length;
  const lane = new Lane(index);
  lane.mesh.position.y = index*positionWidth*zoom;
  scene.add(lane.mesh);
  lanes.push(lane);
}

const chicken = new Chicken();
scene.add( chicken );

const chickenAfterDeath = new deadChicken();
scene.add( chickenAfterDeath );
chickenAfterDeath.visible = false;


hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight)

const initialDirLightPositionX = -100;
const initialDirLightPositionY = -100;
dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200);
dirLight.castShadow = true;
dirLight.target = chicken;
scene.add(dirLight);

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
var d = 500;
dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
// var helper = new THREE.CameraHelper( camera );
// scene.add(helper)

backLight = new THREE.DirectionalLight(0x000000, .4);
backLight.position.set(200, 200, 50);
backLight.castShadow = true;
scene.add(backLight)

/*------ 后续随机生成的基础 -------*/
const laneTypes = ['car', 'truck', 'forest'];
//const laneSpeeds = [3, 8, 10];
const laneSpeedsForEasy = [2,3,4];
const laneSpeedsForMiddle = [4,6,7];
const laneSpeedsForHard = [6,8,10];
const vechicleColors = [0x428eff, 0xffef42, 0xff7b42, 0xff426b]; //小汽车的颜色，后续通过随机数选择车辆颜色
const treeHeights = [20,45,60,30];

/*----- 初始参数设定 -----*/
const initialiseValues = () => {
  lanes = generateLanes()

  currentLane = 0;
  currentColumn = Math.floor(columns/2);

  previousTimestamp = null;

  gameOver = true;

  startMoving = false;
  moves = [];  //记录当前移动轨迹，移动完毕之后会删除
  stepStartTimestamp;

  chicken.position.x = 0;
  chicken.position.y = 0;

  camera.position.y = initialCameraPositionY;
  camera.position.x = initialCameraPositionX;

  dirLight.position.x = initialDirLightPositionX;
  dirLight.position.y = initialDirLightPositionY;
}

initialiseValues();

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*--------  functions  -------*/
/*---- 根据当前难度返回车辆移动速度矩阵 ----*/
function Speed(getlevel) {
  switch(getlevel) {
    case "Easy": {
      return laneSpeedsForEasy;
    }
    case "Middle": {
      return laneSpeedsForMiddle;
    }
    case "Hard": {
      return laneSpeedsForHard;
    }
  }
}



/*---- 利用canvas绘制图片素材并返回THREE.CanvasTexture ----*/
function Texture(width, height, rects) {
  const canvas = document.createElement( "canvas" );
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext( "2d" ); 
  context.fillStyle = "#ffffff"; //先全部新建为白色
  context.fillRect( 0, 0, width, height ); //绘制已经填充的矩形
  context.fillStyle = "rgba(0,0,0,1)";  
  rects.forEach(rect => {
    context.fillRect(rect.x, rect.y, rect.w, rect.h);
  });
  return new THREE.CanvasTexture(canvas);
}

/*------- 生成车轮 -------*/
function Wheel() {
  const wheel = new THREE.Mesh( 
    //new THREE.BoxBufferGeometry( 12*zoom, 33*zoom, 12*zoom ), 
    new THREE.CylinderBufferGeometry(7*zoom, 7*zoom, 33*zoom,30), //圆柱形车轮
    new THREE.MeshLambertMaterial( { color: 0x333333, flatShading: true } ) //Lamber材质，没有镜面反光
  );
  wheel.position.z = 7*zoom;
  return wheel;
}

/*------- 生成小汽车 -------*/
function Car() {
  const car = new THREE.Group(); //生成3d object
  const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)]; //随机数选定汽车颜色
  
  //小汽车底盘
  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 60*zoom, 30*zoom, 15*zoom ), 
    new THREE.MeshPhongMaterial( { color, flatShading: true } )
  );
  main.position.z = 12*zoom;
  main.castShadow = true;
  main.receiveShadow = true;
  car.add(main) 
  
  //小汽车车厢
  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 33*zoom, 24*zoom, 12*zoom ), 
    [
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carBackTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carFrontTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carRightSideTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carLeftSideTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true } ), // top
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true } ) // bottom
    ]
  );
  cabin.position.x = 6*zoom;
  cabin.position.z = 25.5*zoom;
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  car.add( cabin );
  
  //前轮
  const frontWheel = new Wheel();
  frontWheel.position.x = -18*zoom;
  car.add( frontWheel );

  //后轮
  const backWheel = new Wheel();
  backWheel.position.x = 18*zoom;
  car.add( backWheel );

  car.castShadow = true;
  car.receiveShadow = true;
  
  return car;  
}

/*------- 生成卡车 -------*/
function Truck() {
  const truck = new THREE.Group();
  const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];

  //卡车底盘
  const base = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 100*zoom, 25*zoom, 5*zoom ), 
    new THREE.MeshLambertMaterial( { color: 0xb4c6fc, flatShading: true } )
  );
  base.position.z = 10*zoom;
  truck.add(base)

  //卡车箱体
  const cargo = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 75*zoom, 35*zoom, 40*zoom ), 
    new THREE.MeshPhongMaterial( { color: 0xb4c6fc, flatShading: true } )
  );
  cargo.position.x = 15*zoom;
  cargo.position.z = 30*zoom;
  cargo.castShadow = true;
  cargo.receiveShadow = true;
  truck.add(cargo)

  //卡车驾驶舱
  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 25*zoom, 30*zoom, 30*zoom ), 
    [
      new THREE.MeshPhongMaterial( { color, flatShading: true } ), // back
      new THREE.MeshPhongMaterial( { color, flatShading: true, map: truckFrontTexture } ),
      new THREE.MeshPhongMaterial( { color, flatShading: true, map: truckRightSideTexture } ),
      new THREE.MeshPhongMaterial( { color, flatShading: true, map: truckLeftSideTexture } ),
      new THREE.MeshPhongMaterial( { color, flatShading: true } ), // top
      new THREE.MeshPhongMaterial( { color, flatShading: true } ) // bottom
    ]
  );
  cabin.position.x = -40*zoom;
  cabin.position.z = 20*zoom;
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  truck.add( cabin );

  //前轮
  const frontWheel = new Wheel();
  frontWheel.position.x = -38*zoom;
  truck.add( frontWheel );

  //中轮
  const middleWheel = new Wheel();
  middleWheel.position.x = -10*zoom;
  truck.add( middleWheel );

  //后轮
  const backWheel = new Wheel();
  backWheel.position.x = 30*zoom;
  truck.add( backWheel );

  return truck;  
}

/*------- 生成树 -------*/
function Tree() {
  const tree = new THREE.Group();

  //树干
  const trunk = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 15*zoom, 15*zoom, 20*zoom ), 
    new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
  );
  trunk.position.z = 10*zoom;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  height = treeHeights[Math.floor(Math.random()*treeHeights.length)]; //随机树高

  //树冠
  const crown = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 30*zoom, 30*zoom, height*zoom ), 
    new THREE.MeshLambertMaterial( { color: 0x7aa21d, flatShading: true } )
  );
  crown.position.z = (height/2+20)*zoom;
  crown.castShadow = true;
  crown.receiveShadow = false;
  tree.add(crown);

  return tree;  
}

/*------- 生成主人公 -------*/
function Chicken() {
  const chicken = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxBufferGeometry( chickenSize*zoom, chickenSize*zoom, 20*zoom ), 
    new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
  );
  body.position.z = 20*zoom;
  body.castShadow = true;
  body.receiveShadow = true;
  chicken.add(body);

  const rowel = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 2*zoom, 4*zoom, 2*zoom ), 
    new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
  );
  rowel.position.z = 31*zoom;
  rowel.castShadow = true;
  rowel.receiveShadow = false;
  chicken.add(rowel);

  const swing_left = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 5*zoom, 13*zoom, 5*zoom ), 
    new THREE.MeshLambertMaterial( { color: 0xffffff, flatShading: true } )
  );
  swing_left.position.z = 20*zoom;
  swing_left.position.x = -10.5*zoom;
  swing_left.position.y = -5*zoom;
  swing_left.castShadow = true;
  swing_left.receiveShadow = false;
  chicken.add(swing_left);

  const swing_right = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 5*zoom, 13*zoom, 5*zoom ), 
    new THREE.MeshLambertMaterial( { color: 0xffffff, flatShading: true } )
  );
  swing_right.position.z = 20*zoom;
  swing_right.position.x = 10.5*zoom;
  swing_right.position.y = -5*zoom;
  swing_right.castShadow = true;
  swing_right.receiveShadow = false;
  chicken.add(swing_right);

  const tail = new THREE.Mesh(
    new THREE.BoxBufferGeometry( chickenSize*zoom-12, chickenSize*zoom*0.7, 20*zoom*0.4 ), 
    new THREE.MeshLambertMaterial( { color: 0xffffff, flatShading: true } )
  );
  tail.position.z = 20*zoom;
  tail.position.y = -12*zoom;
  tail.castShadow = true;
  tail.receiveShadow = true;
  chicken.add(tail);

  const leg_left = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1.5*zoom, 1.5*zoom, 10*zoom),
    new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
  );
  leg_left.position.x = 3.5*zoom;
  leg_left.position.y = -4*zoom;
  leg_left.position.z = 10*zoom;
  leg_left.castShadow = true;
  leg_left.receiveShadow = false;
  chicken.add(leg_left);

  const leg_right = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1.5*zoom, 1.5*zoom, 10*zoom),
    new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
  );
  leg_right.position.x = -3.5*zoom;
  leg_right.position.y = -4*zoom;
  leg_right.position.z = 10*zoom;
  leg_right.castShadow = true;
  leg_right.receiveShadow = false;
  chicken.add(leg_right);
  
  const foot_left = new THREE.Mesh(
    new THREE.BoxBufferGeometry(5*zoom, 8*zoom, 2*zoom),
    new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
  );
  foot_left.position.x = -3.5*zoom;
  foot_left.position.y = -4*zoom;
  foot_left.position.z = 3*zoom;
  foot_left.castShadow = true;
  foot_left.receiveShadow = false;
  chicken.add(foot_left);

  const foot_right = new THREE.Mesh(
    new THREE.BoxBufferGeometry(5*zoom, 8*zoom, 2*zoom),
    new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
  );
  foot_right.position.x = 3.5*zoom;
  foot_right.position.y = -4*zoom;
  foot_right.position.z = 3*zoom;
  foot_right.castShadow = true;
  foot_right.receiveShadow = false;
  chicken.add(foot_right);

  return chicken;  
}

/*------- 被压扁的chicken -------*/
function deadChicken() {
  const deadChicken = new THREE.Group();

  const body01 = new THREE.Mesh(
    new THREE.BoxBufferGeometry( chickenSize*zoom, chickenSize*zoom, 2*zoom ), 
    new THREE.MeshPhongMaterial( { color: 0xD9D9D9, flatShading: true } )
  );
  body01.position.z = 12*zoom;
  body01.castShadow = true;
  body01.receiveShadow = true;
  deadChicken.add(body01);  //上半身

  const body02 = new THREE.Mesh(
    new THREE.BoxBufferGeometry( chickenSize*zoom, chickenSize*zoom, 2*zoom ), 
    new THREE.MeshPhongMaterial( { color: 0xBFBFBF, flatShading: true } )
  );
  body02.position.z = 10*zoom;
  body02.castShadow = true;
  body02.receiveShadow = true;
  deadChicken.add(body02);  //下半身

  const rowel = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 2*zoom, 4*zoom, 2*zoom ), 
    new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
  );
  rowel.position.z = 15*zoom;
  rowel.castShadow = true;
  rowel.receiveShadow = false;
  deadChicken.add(rowel);

  return deadChicken;  
}



/*------- 生成道路 -------*/
function Road() {
  const road = new THREE.Group();

  const createSection = color => new THREE.Mesh(
    new THREE.PlaneBufferGeometry( boardWidth*zoom, positionWidth*zoom ), 
    new THREE.MeshPhongMaterial( { color } )
  );

  //中间游戏主区域效果
  const middle = createSection(0x454A59);
  middle.receiveShadow = true;
  road.add(middle);

  //左边阴影区
  const left = createSection(0x393D49);
  left.position.x = - boardWidth*zoom;
  road.add(left);

  //右边阴影区
  const right = createSection(0x393D49);
  right.position.x = boardWidth*zoom;
  road.add(right);

  return road;
}

/*------- 生成草地 -------*/
function Grass() {
  const grass = new THREE.Group();

  const createSection = color => new THREE.Mesh(
    new THREE.BoxBufferGeometry( boardWidth*zoom, positionWidth*zoom, 3*zoom ), 
    new THREE.MeshPhongMaterial( { color } )
  );

  //const middle = createSection(0x55f472);x
  const middle = createSection(0xB0DD7F);
  middle.receiveShadow = true;
  grass.add(middle);

  const left = createSection(0x92D050);
  left.position.x = - boardWidth*zoom;
  grass.add(left);

  const right = createSection(0x92D050);
  right.position.x = boardWidth*zoom;
  grass.add(right);

  grass.position.z = 1.5*zoom;
  return grass;
}

/*------- 生成总场地 -------*/
function Lane(index) {
  this.index = index;
  this.type = index <= 0 ? 'field' : laneTypes[Math.floor(Math.random()*laneTypes.length)];

  switch(this.type) {
    case 'field': {
      this.type = 'field';
      this.mesh = new Grass();
      break;
    }
    case 'forest': {
      this.mesh = new Grass();

      this.occupiedPositions = new Set();
      this.threes = [1,2,3,4].map(() => {
        const tree = new Tree();
        let position;
        do {
          position = Math.floor(Math.random()*columns); //随机选定树生成的位置
        }while(this.occupiedPositions.has(position))
          this.occupiedPositions.add(position);
        tree.position.x = (position*positionWidth+positionWidth/2)*zoom-boardWidth*zoom/2;
        this.mesh.add( tree );//添加树元素
        return tree;
      })
      break;
    }
    case 'car' : {
      this.mesh = new Road();
      this.direction = Math.random() >= 0.5;  //设定每条路的同行方向

      const occupiedPositions = new Set();
      this.vechicles = [1,2,3].map(() => {
        const vechicle = new Car();
        let position;
        do {
          position = Math.floor(Math.random()*columns/2);
        }while(occupiedPositions.has(position))
          occupiedPositions.add(position);
        vechicle.position.x = (position*positionWidth*2+positionWidth/2)*zoom-boardWidth*zoom/2;
        if(!this.direction) vechicle.rotation.z = Math.PI;
        this.mesh.add( vechicle );
        return vechicle;
      })

      let currSpeeds = Speed(currLevel);
      //this.speed = laneSpeeds[Math.floor(Math.random()*laneSpeeds.length)];
      this.speed = currSpeeds[Math.floor(Math.random()*currSpeeds.length)];
      break;
    }
    case 'truck' : {
      this.mesh = new Road();
      this.direction = Math.random() >= 0.5;

      const occupiedPositions = new Set();
      this.vechicles = [1,2].map(() => {
        const vechicle = new Truck();
        let position;
        do {
          position = Math.floor(Math.random()*columns/3);
        }while(occupiedPositions.has(position))
          occupiedPositions.add(position);
        vechicle.position.x = (position*positionWidth*3+positionWidth/2)*zoom-boardWidth*zoom/2;
        if(!this.direction) vechicle.rotation.z = Math.PI;
        this.mesh.add( vechicle );
        return vechicle;
      })

      let currSpeeds = Speed(currLevel);
      //this.speed = laneSpeeds[Math.floor(Math.random()*laneSpeeds.length)];
      this.speed = currSpeeds[Math.floor(Math.random()*currSpeeds.length)];
      break;
    }
  }
}

document.querySelector("#retry").addEventListener("click", () => {
  lanes.forEach(lane => scene.remove( lane.mesh ));
  initialiseValues(); //重新初始化

  chicken.scale.set(1,1,1);

  document.getElementById('logo').style.visibility = 'visible';
  document.getElementById('start').style.visibility = 'visible';
  easyBTN.style.visibility = 'visible';
  middleBTN.style.visibility = 'visible';
  hardBTN.style.visibility = 'visible';

  endDOM.style.visibility = 'hidden';
  document.getElementById('score').style.visibility = 'hidden';


});

//document.getElementById('forward').addEventListener("click", () => move('forward'));
document.getElementById('forward').addEventListener("click", event => {
  if(!gameOver){
    move('forward');
  }
});
document.getElementById('backward').addEventListener("click", event => {
  if(!gameOver){
    move('backward');
  }
});
document.getElementById('left').addEventListener("click", event => {
  if(!gameOver){
    move('left');
  }
});
document.getElementById('right').addEventListener("click", event => {
  if(!gameOver){
    move('right');
  }
});


//document.getElementById().addEventListener("click", () => move('backward'));

//document.getElementById().addEventListener("click", () => move('left'));

//document.getElementById().addEventListener("click", () => move('right'));


/*------ 设置键盘仅在游戏时启用------*/
window.addEventListener("keydown", event => {
  if ((event.keyCode == '38') && (!gameOver)) {
    // up arrow
    move('forward');
  }
  else if ((event.keyCode == '40') && (!gameOver)) {
    // down arrow
    move('backward');
  }
  else if ((event.keyCode == '37') && (!gameOver)) {
    // left arrow
    move('left');
  }
  else if ((event.keyCode == '39') && (!gameOver)) {
    // right arrow
    move('right');
  }
});

/*-------- 人物移动逻辑 --------*/
function move(direction) {
  const finalPositions = moves.reduce((position,move) => {
    if(move === 'forward') return {lane: position.lane+1, column: position.column};
    if(move === 'backward') return {lane: position.lane-1, column: position.column};
    if(move === 'left') return {lane: position.lane, column: position.column-1};
    if(move === 'right') return {lane: position.lane, column: position.column+1};
  }, {lane: currentLane, column: currentColumn})

  if (direction === 'forward') {
    //走不通，没有效果
    if(lanes[finalPositions.lane+1].type === 'forest' && lanes[finalPositions.lane+1].occupiedPositions.has(finalPositions.column)) return;
    //可以移动
    if(!stepStartTimestamp) startMoving = true;
    addLane();
  }
  else if (direction === 'backward') {
    if(finalPositions.lane === 0) return;
    if(lanes[finalPositions.lane-1].type === 'forest' && lanes[finalPositions.lane-1].occupiedPositions.has(finalPositions.column)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  else if (direction === 'left') {
    if(finalPositions.column === 0) return;
    if(lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column-1)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  else if (direction === 'right') {
    if(finalPositions.column === columns - 1 ) return;
    if(lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column+1)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  moves.push(direction); //加入moves[] 记录当前移动轨迹，移动完毕之后会删除
}


/*------ 主动画逻辑 ------*/
function animate(timestamp) {
  requestAnimationFrame( animate );

  if(!previousTimestamp) previousTimestamp = timestamp;
  const delta = timestamp - previousTimestamp;
  previousTimestamp = timestamp;


  // 模拟小汽车和卡车的移动
  lanes.forEach(lane => {
    if(lane.type === 'car' || lane.type === 'truck') {
      const BeforeBegin = -boardWidth*zoom/2 - positionWidth*2*zoom;
      const AfterEnd = boardWidth*zoom/2 + positionWidth*2*zoom;
      lane.vechicles.forEach(vechicle => {
        if(lane.direction) {
          vechicle.position.x = vechicle.position.x < BeforeBegin ? AfterEnd : vechicle.position.x -= lane.speed/16*delta;
        }else{
          vechicle.position.x = vechicle.position.x > AfterEnd ? BeforeBegin : vechicle.position.x += lane.speed/16*delta;
        }
      });
    }
  });

  if(startMoving) {
    stepStartTimestamp = timestamp;
    startMoving = false;
  }

  if(stepStartTimestamp) {
    const moveDeltaTime = timestamp - stepStartTimestamp;
    const moveDeltaDistance = Math.min(moveDeltaTime/stepTime,1)*positionWidth*zoom;
    const jumpDeltaDistance = Math.sin(Math.min(moveDeltaTime/stepTime,1)*Math.PI)*8*zoom;
    switch(moves[0]) {
      case 'forward': {
        const positionY = currentLane*positionWidth*zoom + moveDeltaDistance;
        camera.position.y = initialCameraPositionY + positionY; 
        dirLight.position.y = initialDirLightPositionY + positionY; 
        chicken.position.y = positionY; // 主人公初始位置为0

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'backward': {
        positionY = currentLane*positionWidth*zoom - moveDeltaDistance
        camera.position.y = initialCameraPositionY + positionY;
        dirLight.position.y = initialDirLightPositionY + positionY; 
        chicken.position.y = positionY;

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'left': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 - moveDeltaDistance;
        camera.position.x = initialCameraPositionX + positionX;     
        dirLight.position.x = initialDirLightPositionX + positionX; 
        chicken.position.x = positionX; // 主人公初始位置为0
        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'right': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 + moveDeltaDistance;
        camera.position.x = initialCameraPositionX + positionX;       
        dirLight.position.x = initialDirLightPositionX + positionX;
        chicken.position.x = positionX; 

        chicken.position.z = jumpDeltaDistance;
        break;
      }
    }
    document.getElementById('pop').play();

    // 当一次移动已经完成时
    if(moveDeltaTime > stepTime) {
      switch(moves[0]) {
        case 'forward': {
          currentLane++;
          counterDOM.innerHTML = 'Scores: ' + currentLane*10; //更新分数显示
          scores = currentLane*10;   
          break;
        }
        case 'backward': {
          currentLane--;
          counterDOM.innerHTML = 'Scores: ' + currentLane*10;
          scores = currentLane*10;
          break;
        }
        case 'left': {
          currentColumn--;
          break;
        }
        case 'right': {
          currentColumn++;
          break;
        }
      }
      moves.shift();
      
      stepStartTimestamp = moves.length === 0 ? null : timestamp;
    }
  }

  // 碰撞车体检验
  if(lanes[currentLane].type === 'car' || lanes[currentLane].type === 'truck') {
    //主人公的边界
    const chickenMinX = chicken.position.x - chickenSize*zoom/2;
    const chickenMaxX = chicken.position.x + chickenSize*zoom/2;

    const vechicleLength = { car: 60, truck: 105}[lanes[currentLane].type]; 
    lanes[currentLane].vechicles.forEach(vechicle => {
      const carMinX = vechicle.position.x - vechicleLength*zoom/2;
      const carMaxX = vechicle.position.x + vechicleLength*zoom/2;
      if(chickenMaxX > carMinX && chickenMinX < carMaxX) {
        gameOver = true;
        document.getElementById('chicken-death').volume = 1;
        document.getElementById('carhit').volume =1;
        document.getElementById('carhit').play();
        document.getElementById('chicken-death').play();
        chicken.scale.set(1,1,0.3);
        endDOM.style.visibility = 'visible'; //显示游戏结束提示
        document.getElementById('score').innerHTML = 'Your Scores: '+ scores;
        document.getElementById('score').style.visibility = 'visible'; 
        /*let x = chicken.position.x;
        let y = chicken.position.y;
        document.getElementById('dead-chicken').style.left = x;
        document.getElementById('dead-chicken').style.top = y;
        document.getElementById('dead-chicken').style.visibility = 'visible';*/
        //chicken = new deadChicken();

        //deadChicken.position.x = chicken.position.x;
        //deadChicken.position.y = chicken.position.y;

        //chicken.visible = false;
        
        //deadChicken.visible = true;

        //chicken.rotateX(90);



      }
    });

  }
  renderer.render( scene, camera );	
}

requestAnimationFrame( animate );