/**
 * Created by YangShushuo on 2016/9/29 0029.
 */

var TANK_MOTION;
var FIRE = false;
var SCORE = 0;
var LIFE = 99;
var READY_TO_REBORN = false;

var FPS = 60;

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
            e.isMoving = true;
        } else {
            e.isMoving = false;
        }
        if(Math.random() <= ENEMY_SETTING.TURN){
            e.turn(DIRECTION.randomDirection());
        } else {
            e.move(e.direction);
        }
        e.restoreGunShot();
        if(Math.random() <= ENEMY_SETTING.FIRE){
            e.fire();
        }
    });
}

function tankMove(){
    if(TANK_MOTION != null){
        tank.turn(TANK_MOTION);
        tank.isMoving = true;
        tank.move();
    }
    tank.restoreGunShot();
    if(FIRE){
        tank.fire();
    }
}
function bulletMove(){
    Bullets.forEach(function(b){
        b.move();
        b.isHit();
    });
}

var enemyCount = 0;
function createEnemy(){
    if(Enemies.length < 50) {
        Enemies.push(new Tank('E-'+ (++enemyCount),20 + Math.random() * (SCREEN_W - 40), 20 + Math.random() * (SCREEN_H - 40), TANK_SPEED.SLOW, DIRECTION.randomDirection(), OBJ_TYPE.ENEMY,GUN_STYLE.NORMAL,TANK_MAX_SHOTS.ENEMY,TANK_SHOT_INTERVAL.ENEMY));
    }
}

function createTank(){
    tank = new Tank('T-1',SCREEN_W / 2,SCREEN_H - 50,TANK_SPEED.FAST,DIRECTION.UP,OBJ_TYPE.TANK,GUN_STYLE.SHOTGUN,TANK_MAX_SHOTS.TANK,TANK_SHOT_INTERVAL.TANK);
}

function clearBattleField(){
    Enemies = Enemies.filter(function(o){
            return o.isAlive;
        });
    Bullets = Bullets.filter(function(o){
            return o.isAlive;
        });
}

!function refresh(){
    setTimeout(function(){
        tankMove();
        enemyMove();
        bulletMove();
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

function impactEvent(from,to){
    console.log('impact:from ' + from.id + ' to ' + to.id);
    if(to.isMoving){
        to.move();
        to.isMoving = false;
    }
    switch (from.direction) {
        case DIRECTION.UP:
            if((from.isMoving && !to.isMoving) || (from.isMoving && to.isMoving && to.direction != DIRECTION.DOWN)){
                from.y = to.y + 31;
            } else if(from.isMoving && to.isMoving && DIRECTION.DOWN){
                var distance = to.y - from.y;
                var n = distance * from.speed /(from.speed + to.speed);
                from.y += n;
                to.y = to.y - (distance - n);
            }
            break;
        case DIRECTION.DOWN:
            if((from.isMoving && !to.isMoving) || (from.isMoving && to.isMoving && to.direction != DIRECTION.UP)){
                from.y = to.y - 31;
            } else if(from.isMoving && to.isMoving && DIRECTION.UP){
                var distance = from.y - to.y;
                var n = distance * from.speed /(from.speed + to.speed);
                from.y += n;
                to.y = to.y - (distance - n);
            }
            break;
        case DIRECTION.LEFT:
            from.x = e.x + 31;
            break;
        case DIRECTION.RIGHT:
            from.x = e.x - 31;
            break;
    }
}

function reborn(){
    LIFE--;
    if(LIFE > 0){
        createTank();
    }
}