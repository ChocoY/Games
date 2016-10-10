/**
 * Created by YangShushuo on 2016/9/29 0029.
 */


const DIRECTION ={
    UP:Math.PI*0.5,RIGHT:0,DOWN:Math.PI*1.5,LEFT:Math.PI,
    randomDirection: function (){
        return Math.floor(Math.random()*4) * Math.PI/2;
    }
};
const TANK_SPEED = {
    SLOW:3,FAST:5
};
const BULLET_SPEED = {
  SLOW:6,FAST:8
};
const BULLET_TYPE = {
    TANK:0,ENEMY:1
};
const OBJ_TYPE = {
    TANK:0,ENEMY:1,TANK_BULLET:2,ENEMY_BULLET:3
};

const ENEMY_SETTING = {
    MOVE:0.9,FIRE:0.05,TURN:0.1
};

const GUN_STYLE = {
    NORMAL:0,SHOTGUN:1
};
//Obj
class Obj{
    constructor(x,y,speed,direction,type) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.type = type;
        this.isAlive = true;
    }

    die(){
        this.isAlive = false;
    }

    move(direction){
        if(typeof direction != "undefined" && direction != null){
            this.direction = direction;
        }
        switch(direction){
            case DIRECTION.UP:
                this.y -= this.speed;
                break;
            case DIRECTION.DOWN:
                this.y += this.speed;
                break;
            case DIRECTION.LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION.RIGHT:
                this.x += this.speed;
                break;
            default:
                if(this.type == OBJ_TYPE.TANK_BULLET || this.type == OBJ_TYPE.ENEMY_BULLET) {
                    this.y -= this.speed * Math.sin(this.direction);
                    this.x += this.speed * Math.cos(this.direction);
                }
        }
        if(this.type == OBJ_TYPE.TANK || this.type == OBJ_TYPE.ENEMY){
            if(this.x < 15){
                this.x = 15;
            }
            if(this.x > SCREEN_W - 15){
                this.x = SCREEN_W - 15;
            }
            if(this.y < 15){
                this.y = 15;
            }
            if(this.y > SCREEN_H - 15){
                this.y = SCREEN_H - 15;
            }
        }
        if(this.type == OBJ_TYPE.TANK_BULLET || this.type == OBJ_TYPE.TANK_BULLET) {
            if(this.x < 0 || this.x > SCREEN_W || this.y < 0 || this.y > SCREEN_H){
                this.die();
            }
        }
    }
}


//tank
class Tank extends Obj{
    constructor(x,y,speed,direction,type,gunStyle) {
        super(x,y,speed,direction,type);
        this.gunStyle=gunStyle;
    }

    fire(){
        var type;
        var from;
        var direction = this.direction;
        if(this.type == OBJ_TYPE.TANK){
            type = OBJ_TYPE.TANK_BULLET;
            from = BULLET_TYPE.TANK;
        } else {
            type = OBJ_TYPE.ENEMY_BULLET;
            from = BULLET_TYPE.ENEMY;
        }
        var x,y;

        switch(this.direction){
            case DIRECTION.UP:
                x = this.x;
                y = this.y - 15;
                break;
            case DIRECTION.DOWN:
                x = this.x;
                y = this.y + 15;
                break;
            case DIRECTION.LEFT:
                x = this.x - 15;
                y = this.y;
                break;
            case DIRECTION.RIGHT:
                x = this.x + 15;
                y = this.y;
                break;
            default:
        }
        if(this.gunStyle == GUN_STYLE.NORMAL){
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction,type,from));
        } else if(this.gunStyle == GUN_STYLE.SHOTGUN){
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction - Math.PI / 6,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction - Math.PI / 12 ,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction + Math.PI / 12,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction + Math.PI / 6,type,from));
        }
    }
}

//bullet
class Bullet extends Obj{
    constructor(x,y,speed,direction,type,from) {
        super(x,y,speed,direction,type);
        this.from = from;
    }

    isHit (){
        var th = this;
        if(th.type == OBJ_TYPE.TANK_BULLET){
            Enemies.forEach(function (e) {
                if(th.x > e.x - 15 && th.x <e.x + 15 && th.y > e.y - 15 && th.y <e.y + 15 ){
                    e.die();
                    th.die();
                    if(th.type == OBJ_TYPE.TANK_BULLET){
                        SCORE++;
                    }
                    createEnemy();
                    return;
                }
            });
        }

        if(th.type == OBJ_TYPE.ENEMY_BULLET &&th.x > tank.x - 15 && th.x <tank.x + 15 && th.y > tank.y - 15 && th.y <tank.y + 15 ){
            th.die();
            tank.die();
            dieEvent();
        }
    }
}