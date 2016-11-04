/**
 * Created by YangShushuo on 2016/9/29 0029.
 */


var ca = document.getElementsByTagName('canvas')[0];

var SCREEN_W = ca.offsetWidth;
var SCREEN_H = ca.offsetHeight;
ca.width = SCREEN_W;
ca.height = SCREEN_H;
var c = ca.getContext('2d');
c.width = SCREEN_W;
c.height = SCREEN_H;


var lastRefreshTime = Date.now();
function showScore() {
    c.font = SCREEN_H / 30 + 'px Arial';
    c.fillStyle = '#fff';
    c.textAlign = 'start';
    c.textBaseline = 'top';
    var now = Date.now();
    var fps = 1000/(now - lastRefreshTime);
    lastRefreshTime = now;
    c.fillText('score:'+SCORE + ' life:' + LIFE + ' fps:'+ Math.floor(fps),10,10);
}

function drawTank(tank){
    if(tank.type == OBJ_TYPE.TANK){
        c.fillStyle = '#f89';
    } else {
        c.fillStyle = '#fff';
    }
    switch(tank.direction){
        case DIRECTION.UP:
            c.fillRect(tank.x - 2,tank.y - 15,5,5);
            c.fillRect(tank.x - 13,tank.y - 10,27,26);
            c.fillStyle = '#000';
            c.fillRect(tank.x - 5,tank.y + 11,11,5);
            break;
        case DIRECTION.DOWN:
            c.fillRect(tank.x - 2,tank.y + 10,5,5);
            c.fillRect(tank.x - 13,tank.y - 15,27,26);
            c.fillStyle = '#000';
            c.fillRect(tank.x - 5,tank.y - 15,11,5);
            break;
        case DIRECTION.LEFT:
            c.fillRect(tank.x - 15,tank.y - 2,5,5);
            c.fillRect(tank.x - 10,tank.y - 13,26,27);
            c.fillStyle = '#000';
            c.fillRect(tank.x + 11,tank.y - 5,5,11);
            break;
        case DIRECTION.RIGHT:
            c.fillRect(tank.x + 10,tank.y - 2,5,5);
            c.fillRect(tank.x - 15,tank.y - 13,26,27);
            c.fillStyle = '#000';
            c.fillRect(tank.x - 16,tank.y - 5,5,11);
            break;
    }
}

var flashN = 0;
function deadInfo(){
    c.fillStyle = '#fff';

    c.strokeStyle = '#999';
    if(READY_TO_REBORN){
        var str = "GAME OVER";
        c.font = Math.min(SCREEN_H/8,SCREEN_W/12) +"px Arial";
        c.textBaseline = 'bottom';
        c.textAlign = 'center';
        c.fillText(str,SCREEN_W/2,SCREEN_H*2/5);
        c.lineWidth = 3;
        c.strokeText(str,SCREEN_W/2,SCREEN_H*2/5);

        if((flashN = ++flashN)%FPS/4 <=　FPS/8 ) {
            var str = "press Enter to reborn";
            c.font = Math.min(SCREEN_H / 20,SCREEN_W/ 24) + "px Arial";
            c.textBaseline = 'top';
            c.textAlign = 'center';
            c.fillText(str, SCREEN_W / 2, SCREEN_H * 3 / 5);
        }
    }
}
var TANK_BULLET_FILL_STYLE = function(){
    var grd = c.createRadialGradient(75,50,5,90,60,100);
    grd.addColorStop(0,"red");
    grd.addColorStop(1,"white");
    return grd;
};

function draw(){
    c.clearRect(0,0,SCREEN_W,SCREEN_H);
    //c.fillStyle = 'rgba(0,0,0,0.5)';
    //c.fillRect(0,0,SCREEN_W,SCREEN_H);

    Enemies.filter(function(e){
        return e.isAlive;
    }).forEach(function(e){
        drawTank(e);
    });

    Bullets.filter(function(e){
        return e.isAlive;
    }).forEach(function(b){
        if(b.type == OBJ_TYPE.TANK_BULLET){
            c.fillStyle = '#fac';
        } else {
            c.fillStyle = '#ddd';
        }
        c.beginPath();
        c.arc(b.x,b.y,3,0,Math.PI * 2);
        c.fill();
    });

    if(tank.isAlive){
        drawTank(tank);
    }

    showScore();
    deadInfo();
}