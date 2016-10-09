/**
 * Created by YangShushuo on 2016/9/29 0029.
 */

var TANK_MOTION;
var FIRE = false;

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
            default:
            //nothing
        }
    });
}();

function tankMove(){
    tank.move(TANK_MOTION);
    if(FIRE){
        tank.fire();
        FIRE = false;
    }
}
function bulletMove(){
    Bullets.forEach(function(b){
        b.move(b.direction);
        b.isHit();
    })
}

function createEnemy(){
    Enemies.push(new Tank(20 + Math.random() * (SCREEN_W - 40),20 + Math.random() * (SCREEN_H - 40),TANK_SPEED.SLOW,0));
}


!function refresh(){
    setTimeout(function(){
        tankMove();
        bulletMove();

        draw();
        refresh();
    },1000/30);
}();