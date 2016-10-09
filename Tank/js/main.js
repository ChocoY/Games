/**
 * Created by YangShushuo on 2016/9/29 0029.
 */



var Bullets = new Array();
var Enemies = new Array();
var tank;

!function init() {
    tank = new Tank(200,200,5,DIRECTION.UP);
    Enemies.push(new Tank(200,100,5,DIRECTION.DOWN));
    draw();
}();

function start(){

}