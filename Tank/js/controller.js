/**
 * Created by YangShushuo on 2016/9/29 0029.
 */

let TANK_MOTION;
let FIRE = false;
let SCORE = 0;
let LIFE = 99;
let READY_TO_REBORN = false;
let bornTime = Date.now();
let dieTime = 0;

!function initController(){
    window.addEventListener('keydown',function (e){
        switch (e.code){
            case 'ArrowUp':
                TANK_MOTION = DIRECTION.UP;
                break;
            case 'ArrowDown':
                TANK_MOTION = DIRECTION.DOWN;
                break;
            case 'ArrowRight':
                TANK_MOTION = DIRECTION.RIGHT;
                break;
            case 'ArrowLeft':
                TANK_MOTION = DIRECTION.LEFT;
                break;
            case 'Space':
                FIRE = true;
                break;
            case 'Enter':
                if(READY_TO_REBORN){
                    READY_TO_REBORN = false;
                    reborn();
                }
                break;
            default:
                //nothing
        }
    });

    window.addEventListener('keyup',function (e){
        switch (e.code){
            case 'ArrowUp':
                if(TANK_MOTION == DIRECTION.UP){
                    TANK_MOTION = null;
                }
                break;
            case 'ArrowDown':
                if(TANK_MOTION == DIRECTION.DOWN){
                    TANK_MOTION = null;
                }
                break;
            case 'ArrowRight':
                if(TANK_MOTION == DIRECTION.RIGHT){
                    TANK_MOTION = null;
                }
                break;
            case 'ArrowLeft':
                if(TANK_MOTION == DIRECTION.LEFT){
                    TANK_MOTION = null;
                }
                break;
            case 'Space':
                FIRE = false;
                break;
            default:
            //nothing
        }
    });
}();

function enemiesCalcNextMove(){
    Enemies.forEach(function(e){
        if(Math.random() <= ENEMY_SETTING.MOVE){
            e.isMoving = true;
        } else {
            e.isMoving = false;
        }
        if(Math.random() <= ENEMY_SETTING.TURN){
            e.turn(DIRECTION.randomDirection());
        } else {
            e.calcNextMove(e.direction);
        }
        e.restoreGunShot();
        if(Math.random() <= ENEMY_SETTING.FIRE){
            e.fire();
        }
    });
}

function tankCalcNextMove(){
    if(TANK_MOTION != null){
        tank.turn(TANK_MOTION);
        tank.isMoving = true;
        tank.calcNextMove();
    }
    tank.restoreGunShot();
    if(FIRE){
        tank.fire();
    }
}
function bulletsCalcNextMove(){
    Bullets.forEach(function(b){
        b.calcNextMove();
        b.isHit();
    });
}

let enemyCount = 0;
function createEnemy(){
    if(Enemies.length < 50) {
        Enemies.push(new Tank('E-'+ (++enemyCount),20 + Math.random() * (SCREEN_W - 40), 20 + Math.random() * (SCREEN_H - 40), TANK_SPEED.SLOW, DIRECTION.randomDirection(), OBJ_TYPE.ENEMY,GUN_STYLE.NORMAL,TANK_MAX_SHOTS.ENEMY,TANK_SHOT_INTERVAL.ENEMY));
    }
}

function renewLiveTime() {
    bornTime = Date.now();
    dieTime = 0;
}
function createTank(){
    tank = new Tank('T-1',SCREEN_W / 2,SCREEN_H - 50,TANK_SPEED.FAST,DIRECTION.UP,OBJ_TYPE.TANK,GUN_STYLE.NORMAL,TANK_MAX_SHOTS.TANK,TANK_SHOT_INTERVAL.TANK);
    renewLiveTime();
}

function clearBattleField(){
    Enemies = Enemies.filter(function(o){
            return o.isAlive;
        });
    Bullets = Bullets.filter(function(o){
            return o.isAlive;
        });
}

function doMove() {
    tank.moveToNextPosition();
    Enemies.forEach(function(e){
        e.moveToNextPosition();
    });
    Bullets.forEach(function(e){
        e.moveToNextPosition();
    });
}

!function refresh(){
    setTimeout(function(){
        tankCalcNextMove();
        enemiesCalcNextMove();
        bulletsCalcNextMove();
        doMove();
        clearBattleField();
        draw();
        refresh();
    },1000/FPS);
}();

function dieEvent(){
    if(LIFE > 0){
        READY_TO_REBORN = true;
    }
}

function impactDetective(){
    let allTanks = {};
    allTanks.push(tank);
    allTanks.push(Enemies);

    allTanks.forEach(function(t){
        let maxX = t.nextX + 15;
        let minX = t.nextX - 15;
        let maxY = t.nextY + 15;
        let minY = t.nextY - 15;
        allTanks.forEach(function(tt){
            if (t.id != tt.id) {
                if ((minX < tt.nextX - 15 && tt.nextX - 15 < maxX && minY < tt.nextY - 15 && tt.nextY - 15 < maxY)
                    || (minX < tt.nextX - 15 && tt.nextX - 15 < maxX && minY < tt.nextY + 15 && tt.nextY + 15 < maxY)
                    || (minX < tt.nextX + 15 && tt.nextX + 15 < maxX && minY < tt.nextY + 15 && tt.nextY + 15 < maxY)
                    || (minX < tt.nextX + 15 && tt.nextX + 15 < maxX && minY < tt.nextY - 15 && tt.nextY - 15 < maxY)
                ) {
                    impactEvent(tt, tank);
                }
            }
        });
    });
}

function impactEvent(from,to){

}

function reborn(){
    LIFE--;
    if(LIFE > 0){
        createTank();
    }
}