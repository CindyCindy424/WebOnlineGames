/*
  window.onload = function (){
    var startBTN = document.getElementById('begin-my');
    var TimeCnt = document.getElementById('time');
    var myVar;
    
    function startTimer(){ 
        //setInterval() 间隔指定的毫秒数不停地执行指定的代码
        myVar=setInterval(function(){myTimer()},1000);
    }
    
    // 定义一个得到本地时间的函数
    function myTimer(){
        var d=new Date();
        var t=d.toLocaleTimeString();
        var 
        TimeCnt.innerHTML=t;

    }
    
    
    document.querySelector('#begin-my').addEventListener("click", () => {
        document.getElementById('begin-my').style.visibility = 'hidden';
        startTimer();
        console.log("timer 开始啦");
      });
  }*/


window.onload = function () {
  var c = 100;
  var t;

  var startBTN = document.getElementById('begin-my');
  var TimeCnt = document.getElementById('time');

  function my_timedCount() {
    TimeCnt.innerHTML = c;
    c = c + 1;
    t = setTimeout(my_timedCount(), 1);
  }

  function stopCount() {
    clearTimeout(t);
  }

  document.querySelector('#begin-my').addEventListener("click", () => {
    document.getElementById('begin-my').style.visibility = 'hidden';
    my_timedCount();
    console.log("timer 开始啦");
  });
}