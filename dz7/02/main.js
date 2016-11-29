var list = document.getElementById('list');
list.addEventListener('click', function (e) {
    var target = e.target,
        cookieName = e.target.id;
    if(!e.target.classList.contains('delbutton')) return;

    if(confirm(`Вы действительно хотите удалить cookie  с именем ${cookieName}`)){

        var date = new Date(0);
        document.cookie = cookieName+"=; path=/; expires=" + date.toUTCString();
        console.log('удаляем '+cookieName+"=; path=/; expires=" + date.toUTCString());
        writeTable();

    }

});
var addCookie = document.getElementById('addCookie');
addCookie.addEventListener('click', function () {
    var cookieName = document.getElementById('cookieName');
    var cookieValue = document.getElementById('cookieValue');
    var cookieDay = document.getElementById('cookieDay');
    if(cookieName && cookieValue && cookieValue){
        var date = new Date(new Date().getTime() + cookieDay.value*24*60 * 1000);
        document.cookie = `${cookieName.value}=${cookieValue.value}; path=/; expires= ${date.toUTCString()}`;
        writeTable();
    }
    else
        alert('Для добавления cookie  необходимо заполнить все поля');
});
function getCookie() {
    var cookies = {};
    var table = '',
        row = '' ,
        ca  = [];
    if(document.cookie.length)
        ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var pos=ca[i].indexOf('=');
        cookies[ca[i].substr(0,pos)] = ca[i].substr(pos+1,ca[i].length);
    }
    return cookies;
}
function writeTable(){
    var cookies =  getCookie();
    console.log(cookies,Object.keys(cookies).length);
    if(!Object.keys(cookies).length){
        list.innerHTML = '';
        return false;
    }
    list.innerHTML = '';
    for( var item in cookies){
        let row = document.createElement('tr');
        row.insertCell(0).innerHTML = item;
        row.insertCell(1).innerHTML = cookies[item];
        row.insertCell(2).innerHTML = `<button  class ='delbutton' id='${item}'> Удалить </button>`;
        list.appendChild(row);
    }

};

writeTable();