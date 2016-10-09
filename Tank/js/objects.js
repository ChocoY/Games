/**
 * Created by YangShushuo on 2016/9/29 0029.
 */


var DIRECTION ={
    UP:0,RIGHT:1,DOWN:2,LEFT:3
};
var TANK_SPEED = {
    SLOW:5,FAST:12
};
var BULLET_SPEED = {
  SLOW:8,FAST:12
};
var BULLET_TYPE = {
    TANK:0,ENEMY:1
};

//Obj
class Obj{
    constructor(x,y,speed,direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
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
            // nothing
        }
    }
}


//tank
class Tank extends Obj{
    fire(){
        switch(this.direction){
            case DIRECTION.UP:
                Bullets.push(new Bullet(this.x,this.y - 15,BULLET_SPEED.FAST,this.direction,BULLET_TYPE.TANK));
                break;
            case DIRECTION.DOWN:
                Bullets.push(new Bullet(this.x,this.y + 15,BULLET_SPEED.FAST,this.direction,BULLET_TYPE.TANK));
                break;
            case DIRECTION.LEFT:
                Bullets.push(new Bullet(this.x-15,this.y,BULLET_SPEED.FAST,this.direction,BULLET_TYPE.TANK));
                break;
            case DIRECTION.RIGHT:
                Bullets.push(new Bullet(this.x+15,this.y,BULLET_SPEED.FAST,this.direction,BULLET_TYPE.TANK));
                break;
            default:
            // nothing
        }
    }
}

//bullet
class Bullet extends Obj{
    constructor(x,y,speed,direction,from) {
        super(x,y,speed,direction);
        this.from = from;
    }

    isHit (){
        var th = this;
        Enemies.forEach(function (e) {
            if(th.x > e.x - 15 && th.x <e.x + 15 && th.y > e.y - 15 && th.y <e.y + 15 ){
                e.die();
                th.die();
                createEnemy();
                if(Enemies.length < 30){
                    createEnemy();
                }

                return;
            }
        });

        Enemies.sort(function(e1,e2){
            if(!e1.isAlive && e2.isAlive){
                return -1;
            } else if(e1.isAlive && !e2.isAlive){
                return 1;
            } else {
                return 0;
            }
        });
        for(var i in Enemies){
            if(Enemies[i].isAlive){
                while(i-- > 0){
                    Enemies.shift();
                }
                break;
            }
        }
    }
}