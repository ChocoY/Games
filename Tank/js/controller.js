/**
 * Created by YangShushuo on 2016/9/29 0029.
 */

var TANK_MOTION;
var FIRE = false;
var SCORE = 0;
var LIFE = 99;
var READY_TO_REBORN = false;

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

function enemyMove(){
    Enemies.forEach(function(e){
        if(Math.random() <= ENEMY_SETTING.MOVE){
            if(Math.random() <= ENEMY_SETTING.TURN){
                e.move(DIRECTION.randomDirection());
            } else {
                e.move(e.direction);
            }
        }

        if(Math.random() <= ENEMY_SETTING.FIRE){
            e.fire();
        }
    });
}

function tankMove(){
    tank.move(TANK_MOTION);
    if(FIRE){
        tank.fire();
    }
}
function bulletMove(){
    Bullets.forEach(function(b){
        b.move();
        b.isHit();
    })
}

function createEnemy(){
    if(Enemies.length < 25) {
        Enemies.push(new Tank(20 + Math.random() * (SCREEN_W - 40), 20 + Math.random() * (SCREEN_H - 40), TANK_SPEED.SLOW, DIRECTION.randomDirection(), OBJ_TYPE.ENEMY,GUN_STYLE.NORMAL));
    }
}

function createTank(){
    tank = new Tank(SCREEN_W / 2,SCREEN_H - 50,TANK_SPEED.FAST,DIRECTION.UP,OBJ_TYPE.TANK,GUN_STYLE.NORMAL);
}

function clearBattleField(){

    function clearDead(objArray){
        objArray.sort(function(e1,e2){
            if(!e1.isAlive && e2.isAlive){
                return -1;
            } else if(e1.isAlive && !e2.isAlive){
                return 1;
            } else {
                return 0;
            }
        });
        for(var i in objArray){
            if(objArray[i].isAlive){
                while(i-- > 0){
                    objArray.shift();
                }
                break;
            }
        }
    }
    clearDead(Enemies);
    clearDead(Bullets);
}

!function refresh(){
    setTimeout(function(){
        tankMove();
        enemyMove();
        bulletMove();
        clearBattleField();
        draw();
        refresh();
    },1000/40);
}();

function dieEvent(){
    if(LIFE > 0){
        READY_TO_REBORN = true;
    }
}

function reborn(){
    LIFE--;
    if(LIFE > 0){
        createTank();
    }
}