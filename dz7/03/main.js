var container = document.getElementById('container');
var btnCreator = document.getElementById('btnCreator');
btnCreator.addEventListener('click', createDiv);
container.addEventListener('mousedown',function dragDiv(e){
    var target =  e.target;
    if(target.id !='moveMe') return;
    var shiftX = e.pageX - getCoords(target).left;
    var shiftY = e.pageY - getCoords(target).top;
    moveAt(e);
    function moveAt(e) {
        target.style.left = e.pageX - shiftX + 'px';
        target.style.top = e.pageY - shiftY  + 'px';
    }
    document.onmousemove = function(e) {
        moveAt(e);
    };
    target.onmouseup = function() {
        document.onmousemove = null;
        target.onmouseup = null;
    };
});
var btnSave = document.getElementById('btnSave');
btnSave.addEventListener('click', function (e) {
    var elms = document.querySelectorAll('div.divMovable');
    var divs = {},
        name = '',
        value = '';
    console.log(elms);
    for(var i =0; i<elms.length; i++){
        console.log(elms[i].tagName);
        name = 'div'+i;
        value = `${elms[i].style.top}:${elms[i].style.left}:${elms[i].style.height}:${elms[i].style.width}:${elms[i].style.backgroundColor}`;
        console.log(name, value);
        var date = new Date(new Date().getTime() + 20*24*60 * 1000);
        document.cookie = `${name}=${value}; path=/; expires= ${date.toUTCString()}`;

    }
});
document.addEventListener('DOMContentLoaded', function (e) {
    var cookies  = getCookie();
    for( var item in cookies) {
        if(item.substr(0,3) == 'div') {
            let options = cookies[item].split(':');
            console.log(options);
            createDiv(options[0], options[1], options[2], options[3], options[4]);
        }
    }
});

//helpers
function createDiv(top, left, height, width, bgColor ) {
    var div = document.createElement('div');
    div.style.backgroundColor = bgColor || '#'+Math.random().toString(16).slice(2, 8).toUpperCase()
    div.style.width = width || getRandomInt(10,900)+'px';
    div.style.height = height || getRandomInt(10,800)+'px';
    div.style.top = top || getRandomInt(0,400)+'px';
    div.style.left = left || getRandomInt(10,400)+'px';
    div.setAttribute('class','divMovable');
    div.setAttribute('id','moveMe');
    container.appendChild(div);

};
function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
function getCookie() {
    var cookies = {};
    var table = '',
        row = '' ,
        ca  = [];
    if(document.cookie.length)
        ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var pos=ca[i].indexOf('=');
        cookies[ca[i].substr(0,pos).trim()] = ca[i].substr(pos+1,ca[i].length).trim();
    }
    return cookies;
};