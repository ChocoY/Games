/**
 * Created by YangShushuo on 2016/12/7 0007.
 */

const DIRECTION = {
    UP: Math.PI * 0.5, RIGHT: 0, DOWN: Math.PI * 1.5, LEFT: Math.PI,
    randomDirection: function () {
        return Math.floor(Math.random() * 4) * Math.PI / 2;
    },
    displayDirection: function (direction) {
        switch (direction) {
            case DIRECTION.UP:
                return 'UP';
                break;
            case DIRECTION.DOWN:
                return 'DOWN';
                break;
            case DIRECTION.LEFT:
                return 'LEFT';
                break;
            case DIRECTION.RIGHT:
                return 'RIGHT';
                break;
            default:
                let deg = Math.floor(direction * 90 / Math.PI);
                return (deg > 0 ? deg : 360 + deg) + 'deg';
        }
    }
};
const TANK_SPEED = {
    SLOW: 2, FAST: 3
};
const BULLET_SPEED = {
    SLOW: 4, FAST: 6
};
const BULLET_TYPE = {
    TANK: 0, ENEMY: 1
};
const BULLET_VOLUME = 3;
const OBJ_TYPE = {
    TANK: 0, ENEMY: 1, BULLET: 2
};

const ENEMY_SETTING = {
    MOVE: 0.8, FIRE: 0.05, TURN: 0.04
};

const GUN_STYLE = {
    NORMAL: 0, SHOTGUN: 1, LASER: 2
};
const TANK_SHOT_INTERVAL = {
    TANK: 15, ENEMY: 40
};
const TANK_MAX_SHOTS = {
    TANK: 3, ENEMY: 1
};
const COLORS = {
    TANK:'#f89',
    ENEMY: 'white',
    TANK_BULLET:'#fac',
    ENEMY_BULLET:'#ddd'
};
const FPS = 60;
const BOW_DELAY = FPS/5; //frame

function log(e){
    console.log(e);
}