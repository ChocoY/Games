/**
 * Created by YangShushuo on 2016/9/29 0029.
 */


var ca = document.getElementsByTagName('canvas')[0];

var SCREEN_W = ca.offsetWidth;
var SCREEN_H = ca.offsetHeight;
ca.width = SCREEN_W;
ca.height = SCREEN_H;
var c = ca.getContext('2d');
c.width = SCREEN_W;
c.height = SCREEN_H;

function draw(){
    c.clearRect(0,0,SCREEN_W,SCREEN_H);

    Enemies.filter(function(e){
        return e.isAlive;
    }).forEach(function(o){
        c.fillStyle = '#fff';
        c.fillRect(o.x - 15,o.y - 15,31,31);
    });

    Bullets.filter(function(e){
        return e.isAlive;
    }).forEach(function(b){
        c.fillStyle = '#f88';
        switch (b.direction){
            case DIRECTION.UP:
            case DIRECTION.DOWN:
                c.fillRect(b.x - 1,b.y - 4,3,9);
                break;
            case DIRECTION.LEFT:
            case DIRECTION.RIGHT:
                c.fillRect(b.x - 4,b.y - 1,9,3);
                break;
            default:
                //
        }
    });

    c.fillStyle = '#fcc';
    c.fillRect(tank.x - 15,tank.y - 15,31,31);
}