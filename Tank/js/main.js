/**
 * Created by YangShushuo on 2016/9/29 0029.
 */



let Bullets = [];
let Enemies = [];
let tank;

!function init() {
    createTank();
    createEnemy();
    draw();
}();