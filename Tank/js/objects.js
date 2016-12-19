/**
 * Created by YangShushuo on 2016/9/29 0029.
 */
//Obj
class Obj {
    constructor(id, x, y, speed, direction, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.type = type;
        this.isAlive = true;
        this.isMoving = false;
        this.nextX = this.x;
        this.nextY = this.y;
    }

    die() {
        this.isAlive = false;
    }

    turn(direction) {
        this.direction = direction;
    }

    calcNextMove() {
        if (!this.isMoving) {
            return;
        }
        let nextX = this.x, nextY = this.y;
        switch (this.direction) {
            case DIRECTION.UP:
                this.nextY = this.y - this.speed;
                break;
            case DIRECTION.DOWN:
                this.nextY = this.y + this.speed;
                break;
            case DIRECTION.LEFT:
                this.nextX = this.x - this.speed;
                break;
            case DIRECTION.RIGHT:
                this.nextX = this.x + this.speed;
                break;
            default:
                if (this.type == OBJ_TYPE.TANK_BULLET || this.type == OBJ_TYPE.ENEMY_BULLET) {
                    this.nextY -= this.speed * Math.sin(this.direction);
                    this.nextX += this.speed * Math.cos(this.direction);
                }
        }
    }

    moveToNextPosition() {
        this.x = this.nextX;
        this.y = this.nextY;
    }
}


//tank
class Tank extends Obj {
    constructor(id, x, y, speed, direction, type, gunStyle, maxShots, interval) {
        super(id, x, y, speed, direction, type);
        this.gunStyle = gunStyle;
        this.maxShots = maxShots;
        this.interval = interval;
        this.cooldownArray = [];
    }

    calcNextMove() {
        super.calcNextMove();

        //Tanks must stay in the map
        if (this.nextX < 15) {
            this.nextX = 15;
        }
        if (this.nextX > SCREEN_W - 15) {
            this.nextX = SCREEN_W - 15;
        }
        if (this.nextY < 15) {
            this.nextY = 15;
        }
        if (this.nextY > SCREEN_H - 15) {
            this.nextY = SCREEN_H - 15;
        }
    }

    fire() {
        if (this.isAlive && this.maxShots > 0) {
            this.maxShots--;
            this.cooldownArray.push(this.interval);
            Bullet.create(this);
        }
    }

    restoreGunShot() {
        let array = [];
        for (let i = 0; i < this.cooldownArray.length; i++) {
            if (this.cooldownArray[i] == 0) {
                this.maxShots++;
            } else {
                array.push(this.cooldownArray[i] - 1);
            }
        }
        this.cooldownArray = array;
    }
    die(){
        super.die();
        if(this.type == OBJ_TYPE.TANK){
            dieTime = Date.now();
        }
    }

    bow() {
        this.die();
        bow(this.x, this.y, 15,this.type);
    }
}

//bullet
class Bullet extends Obj {
    constructor(x, y, speed, direction, type, from) {
        super(null, x, y, speed, direction, type);
        this.from = from;
        this.isMoving = true;
    }

    calcNextMove() {
        super.calcNextMove()

        //Bullets will die after getting out of the world
        if (this.x < 0 || this.x > SCREEN_W || this.y < 0 || this.y > SCREEN_H) {
            this.die();
        }
    }

    isHit() {
        let th = this;
        if (th.isAlive) {
            if (th.type == OBJ_TYPE.TANK_BULLET) {
                Enemies.filter(function (e) {
                    return e.isAlive;
                }).forEach(function (e) {
                    if (th.x > e.x - 15 && th.x < e.x + 15 && th.y > e.y - 15 && th.y < e.y + 15) {
                        e.bow();
                        th.die();
                        if (th.type == OBJ_TYPE.TANK_BULLET) {
                            SCORE++;
                        }
                        createEnemy();
                        createEnemy();
                        return;
                    }
                });

                Bullets.filter(function (b) {
                    return b.isAlive && b.type == OBJ_TYPE.ENEMY_BULLET;
                }).forEach(function (b) {
                    if (Math.pow((b.x - th.x), 2) + Math.pow((b.y - th.y), 2) < (2 * BULLET_VOLUME) * (2 * BULLET_VOLUME)) {
                        b.die();
                        th.die();
                    }
                });
            }

            if (th.type == OBJ_TYPE.ENEMY_BULLET && tank.isAlive && th.x > tank.x - 15 && th.x < tank.x + 15 && th.y > tank.y - 15 && th.y < tank.y + 15) {
                th.die();
                tank.bow();
                dieEvent();
            }
        }
    }

    static create(tank){
        let type;
        let from;
        let direction = tank.direction;
        if (tank.type == OBJ_TYPE.TANK) {
            type = OBJ_TYPE.BULLET;
            from = BULLET_TYPE.TANK;
        } else {
            type = OBJ_TYPE.BULLET;
            from = BULLET_TYPE.ENEMY;
        }
        let x, y;

        switch (tank.direction) {
            case DIRECTION.UP:
                x = tank.x;
                y = tank.y - 15;
                break;
            case DIRECTION.DOWN:
                x = tank.x;
                y = tank.y + 15;
                break;
            case DIRECTION.LEFT:
                x = tank.x - 15;
                y = tank.y;
                break;
            case DIRECTION.RIGHT:
                x = tank.x + 15;
                y = tank.y;
                break;
            default:
        }
        if (tank.gunStyle == GUN_STYLE.NORMAL) {
            Bullets.push(new Bullet(x, y, BULLET_SPEED.FAST, direction, type, from));
        } else if (tank.gunStyle == GUN_STYLE.SHOTGUN) {
            var count = 2;
            Bullets.push(new Bullet(x, y, BULLET_SPEED.FAST, direction, type, from));
            for(let i = 1; i <= count;i++ ){
                Bullets.push(new Bullet(x, y, BULLET_SPEED.FAST, direction + Math.PI * i / 24, type, from));
                Bullets.push(new Bullet(x, y, BULLET_SPEED.FAST, direction - Math.PI * i / 24, type, from));
            }
        } else if(tank.gunStyle == GUN_STYLE.LASER){

        }
    }

    bow() {
        this.die();
        bow(this.x, this.y, BULLET_VOLUME);
    }
}

class Lasor extends Bullet{

}