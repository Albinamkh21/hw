document.cookie = 'userName = Albina; path=/;';
document.cookie = 'account = 12548; path=/;';
var date = new Date(new Date().getTime() + 60 * 1000);
document.cookie = "name=value; path=/; expires=" + date.toUTCString();


var list = document.getElementById('list');
list.addEventListener('click', function (e) {
    var target = e.target,
        cookieName = e.target.id;
    if(!e.target.classList.contains('delbutton')) return;

    if(confirm(`Вы действительно хотите удалить cookie  с именем ${cookieName}`)){

        var date = new Date(0);
        document.cookie = cookieName+"=; path=/; expires=" + date.toUTCString();
        writeTable();

    }

});
function getCookie() {
    var cookies = {};
    var ca = document.cookie.split(';');
    console.log(document.cookie);
    console.log(ca);
    var table = '',
        row = ''    ;
    for(var i = 0; i < ca.length; i++) {
        var pos=ca[i].indexOf('=');
        cookies[ca[i].substr(0,pos).trim()] = ca[i].substr(pos+1,ca[i].length).trim();
    }
    console.log(cookies);
    return cookies;
}
function writeTable(){
    var cookies =  getCookie();
    console.log(Object.keys(cookies).length);
    if(!Object.keys(cookies).length){
        list.innerHTML = '';
        return false;
    }
    list.innerHTML = '';
    for( var item in cookies){
        if(!cookies[item].trim()) return;
        let row = document.createElement('tr');
        row.insertCell(0).innerHTML = item;
        row.insertCell(1).innerHTML = cookies[item];
        row.insertCell(2).innerHTML = `<button  class ='delbutton' id='${item}'> Удалить </button>`;
        list.appendChild(row);
    }

};

writeTable();