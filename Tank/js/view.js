/**
 * Created by YangShushuo on 2016/9/29 0029.
 */


let ca = document.getElementsByTagName('canvas')[0];

let SCREEN_W = ca.offsetWidth;
let SCREEN_H = ca.offsetHeight;
ca.width = SCREEN_W;
ca.height = SCREEN_H;
let c = ca.getContext('2d');
c.width = SCREEN_W;
c.height = SCREEN_H;


let lastRefreshTime = Date.now();
function showScore() {
    c.font = SCREEN_H / 40 + 'px Arial';
    c.fillStyle = '#fff';
    c.textAlign = 'start';
    c.textBaseline = 'top';
    let now = Date.now();
    let fps = 1000 / (now - lastRefreshTime);
    lastRefreshTime = now;

    let liveInfo = tank.isAlive ? ' living:' + Math.floor((Date.now() - bornTime)/10)/100 : ' living:' + (dieTime - bornTime) / 1000;
    liveInfo+='00';
    liveInfo = liveInfo.substr(0,liveInfo.indexOf('.') + 3);
    c.fillText('score:' + SCORE + ' life:' + LIFE + liveInfo + 's fps:' + Math.floor(fps), 10, 10);
}
BOWS = [];
class Bow {
    constructor(x, y, r, type) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.t = BOW_DELAY;
    }
}

function bow(x, y, r, type) {
    BOWS.push(new Bow(x, y, r, type));
}

function drawBows() {
    let newBows = [];
    for (let bow of BOWS) {
        if (bow.t > 0) {
            c.strokeStyle = bow.type == OBJ_TYPE.TANK ? COLORS.TANK : COLORS.ENEMY;//bow.t/BOW_DELAY/2
            c.beginPath();
            c.lineWidth = bow.t / BOW_DELAY * bow.r;
            c.arc(bow.x, bow.y, bow.r * (0.5 + (BOW_DELAY - bow.t) / BOW_DELAY), 0, 2 * Math.PI);
            c.stroke();
            /*c.arc(bow.x,bow.y,bow.r*(1+ (BOW_DELAY - bow.t)/BOW_DELAY),0,2*Math.PI);
             c.stroke();*/
            bow.t--;
            newBows.push(bow);
        }
        BOWS = newBows;
    }
}

function drawTank(tank) {
    if (tank.type == OBJ_TYPE.TANK) {
        c.fillStyle = COLORS.TANK;
    } else {
        c.fillStyle = COLORS.ENEMY;
    }
    switch (tank.direction) {
        case DIRECTION.UP:
            c.fillRect(tank.x - 2, tank.y - 15, 5, 5);
            c.fillRect(tank.x - 13, tank.y - 10, 27, 26);
            c.fillStyle = '#000';
            c.fillRect(tank.x - 5, tank.y + 11, 11, 5);
            break;
        case DIRECTION.DOWN:
            c.fillRect(tank.x - 2, tank.y + 10, 5, 5);
            c.fillRect(tank.x - 13, tank.y - 15, 27, 26);
            c.fillStyle = '#000';
            c.fillRect(tank.x - 5, tank.y - 15, 11, 5);
            break;
        case DIRECTION.LEFT:
            c.fillRect(tank.x - 15, tank.y - 2, 5, 5);
            c.fillRect(tank.x - 10, tank.y - 13, 26, 27);
            c.fillStyle = '#000';
            c.fillRect(tank.x + 11, tank.y - 5, 5, 11);
            break;
        case DIRECTION.RIGHT:
            c.fillRect(tank.x + 10, tank.y - 2, 5, 5);
            c.fillRect(tank.x - 15, tank.y - 13, 26, 27);
            c.fillStyle = '#000';
            c.fillRect(tank.x - 16, tank.y - 5, 5, 11);
            break;
    }
}

let flashN = 0;
function deadInfo() {
    c.fillStyle = '#fff';

    c.strokeStyle = '#999';
    if (READY_TO_REBORN) {
        let str = "GAME OVER";
        c.font = Math.min(SCREEN_H / 8, SCREEN_W / 12) + "px Arial";
        c.textBaseline = 'bottom';
        c.textAlign = 'center';
        c.fillText(str, SCREEN_W / 2, SCREEN_H * 2 / 5);
        c.lineWidth = (Math.min(SCREEN_H / 8, SCREEN_W / 12) / 30);
        c.strokeText(str, SCREEN_W / 2, SCREEN_H * 2 / 5);

        str = "lived for " + Math.floor((dieTime - bornTime) / 10)/100 + 's';
        c.font = Math.min(SCREEN_H / 20, SCREEN_W / 24) + "px Arial";
        c.textBaseline = 'top';
        c.textAlign = 'center';
        c.fillText(str, SCREEN_W / 2, SCREEN_H /2);

        if ((flashN = ++flashN) % FPS / 4 <= FPS / 8) {
            let str = "press Enter to reborn";
            c.font = Math.min(SCREEN_H / 20, SCREEN_W / 24) + "px Arial";
            c.textBaseline = 'top';
            c.textAlign = 'center';
            c.fillText(str, SCREEN_W / 2, SCREEN_H * 3 / 5);
        }
    }
}
let TANK_BULLET_FILL_STYLE = function () {
    let grd = c.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");
    return grd;
};

function draw() {
    //c.clearRect(0, 0, SCREEN_W, SCREEN_H);
    c.fillStyle = 'rgba(0,0,0,0.5)';
    c.fillRect(0,0,SCREEN_W,SCREEN_H);

    Enemies.filter(function (e) {
        return e.isAlive;
    }).forEach(function (e) {
        drawTank(e);
    });

    Bullets.filter(function (e) {
        return e.isAlive;
    }).forEach(function (b) {
        if (b.type == OBJ_TYPE.TANK_BULLET) {
            c.fillStyle = COLORS.TANK_BULLET;
        } else {
            c.fillStyle = COLORS.ENEMY_BULLET;
        }
        c.beginPath();
        c.arc(b.x, b.y, 3, 0, Math.PI * 2);
        c.fill();
    });

    if (tank.isAlive) {
        drawTank(tank);
    }
    drawBows();
    showScore();
    deadInfo();
}