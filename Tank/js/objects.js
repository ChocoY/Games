/**
 * Created by YangShushuo on 2016/9/29 0029.
 */


const DIRECTION ={
    UP:Math.PI*0.5,RIGHT:0,DOWN:Math.PI*1.5,LEFT:Math.PI,
    randomDirection: function (){
        return Math.floor(Math.random()*4) * Math.PI/2;
    },
    displayDirection: function(direction){
        switch(direction){
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
                var deg = Math.floor(direction * 90 /Math.PI);
                return (deg>0?deg:360+deg)+'deg';
        }
    }
};
const TANK_SPEED = {
    SLOW:0,FAST:4
};
const BULLET_SPEED = {
  SLOW:5,FAST:8
};
const BULLET_TYPE = {
    TANK:0,ENEMY:1
};
const BULLET_VOLUME = 3;
const OBJ_TYPE = {
    TANK:0,ENEMY:1,TANK_BULLET:2,ENEMY_BULLET:3
};

const ENEMY_SETTING = {
    MOVE:0.3,FIRE:0.05,TURN:0.05
};

const GUN_STYLE = {
    NORMAL:0,SHOTGUN:1
};
const TANK_SHOT_INTERVAL = {
  TANK:15,ENEMY:30
};
const TANK_MAX_SHOTS = {
  TANK:3,ENEMY:0
};

//Obj
class Obj{
    constructor(id,x,y,speed,direction,type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.type = type;
        this.isAlive = true;
        this.isMoving = false;
    }

    die(){
        this.isAlive = false;
    }

    turn(direction){
        this.direction = direction;
    }

    move(){
        if(!this.isMoving){
            return;
        }
        switch(this.direction){
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
        if(this.type == OBJ_TYPE.TANK_BULLET || this.type == OBJ_TYPE.ENEMY_BULLET) {
            if(this.x < 0 || this.x > SCREEN_W || this.y < 0 || this.y > SCREEN_H){
                this.die();
            }
        }
        this.impactDetective();
    }

    impactDetective(){
        var th = this;
        if(th.type == OBJ_TYPE.TANK || th.type == OBJ_TYPE.ENEMY ) {
            var e = tank;
            if (e.id != th.id) {
                var maxX = e.x + 15;
                var minX = e.x - 15;
                var maxY = e.y + 15;
                var minY = e.y - 15;
                if ((minX < th.x - 15 && th.x - 15 < maxX && minY < th.y - 15 && th.y - 15 < maxY)
                    || (minX < th.x - 15 && th.x - 15 < maxX && minY < th.y + 15 && th.y + 15 < maxY)
                    || (minX < th.x + 15 && th.x + 15 < maxX && minY < th.y + 15 && th.y + 15 < maxY)
                    || (minX < th.x + 15 && th.x + 15 < maxX && minY < th.y - 15 && th.y - 15 < maxY)
                ) {
                    impactEvent(th, tank);
                }
            }
            Enemies.forEach(function (e) {
                if (e.id != th.id) {
                    var maxX = e.x + 15;
                    var minX = e.x - 15;
                    var maxY = e.y + 15;
                    var minY = e.y - 15;
                    if ((minX < th.x - 15 && th.x - 15 < maxX && minY < th.y - 15 && th.y - 15 < maxY)
                        || (minX < th.x - 15 && th.x - 15 < maxX && minY < th.y + 15 && th.y + 15 < maxY)
                        || (minX < th.x + 15 && th.x + 15 < maxX && minY < th.y + 15 && th.y + 15 < maxY)
                        || (minX < th.x + 15 && th.x + 15 < maxX && minY < th.y - 15 && th.y - 15 < maxY)
                    ) {
                        impactEvent(th, tank);
                    }
                }
            });
        }
    }
}


//tank
class Tank extends Obj{
    constructor(id,x,y,speed,direction,type,gunStyle,maxShots,interval) {
        super(id,x,y,speed,direction,type);
        this.gunStyle=gunStyle;
        this.maxShots = maxShots;
        this.interval = interval;
        this.cooldownArray = [];
    }

    fire(){
        if(!this.isAlive || this.maxShots <= 0){
            return;
        } else {
            this.maxShots--;
            this.cooldownArray.push(this.interval);
        }

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

            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction - Math.PI *4/ 12,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction - Math.PI *3/ 12 ,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction + Math.PI *4/ 12,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction + Math.PI *3/ 12 ,type,from));
            /*Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction - Math.PI *5/ 12,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction - Math.PI *6/ 12 ,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction + Math.PI *5/ 12,type,from));
            Bullets.push(new Bullet(x,y,BULLET_SPEED.FAST,direction + Math.PI *6/ 12 ,type,from));*/
        }
    }

    restoreGunShot(){
        var array = [];
        for(var i = 0;i < this.cooldownArray.length;i++){
            if(this.cooldownArray[i] == 0){
                this.maxShots++;
            } else {
                array.push(this.cooldownArray[i] - 1);
            }
        }
        this.cooldownArray = array;
    }
}

//bullet
class Bullet extends Obj{
    constructor(x,y,speed,direction,type,from) {
        super(null,x,y,speed,direction,type);
        this.from = from;
    }

    isHit(){
        var th = this;
        if(th.isAlive){
            if(th.type == OBJ_TYPE.TANK_BULLET){
                Enemies.filter(function(e){
                    return e.isAlive;
                }).forEach(function (e) {
                    if(th.x > e.x - 15 && th.x <e.x + 15 && th.y > e.y - 15 && th.y <e.y + 15 ){
                        e.die();
                        th.die();
                        if(th.type == OBJ_TYPE.TANK_BULLET){
                            SCORE++;
                        }
                        createEnemy();
                        createEnemy();
                        return;
                    }
                });

                Bullets.filter(function(b){
                    return b.isAlive && b.type == OBJ_TYPE.ENEMY_BULLET;
                }).forEach(function(b) {
                    if (Math.pow((b.x - th.x), 2) + Math.pow((b.y - th.y), 2) < (2*BULLET_VOLUME) * (2*BULLET_VOLUME)) {
                        b.die();
                        th.die();
                    }
                });
            }

            if(th.type == OBJ_TYPE.ENEMY_BULLET && tank.isAlive && th.x > tank.x - 15 && th.x <tank.x + 15 && th.y > tank.y - 15 && th.y <tank.y + 15 ){
                th.die();
                tank.die();
                dieEvent();
            }
        }
    }
}