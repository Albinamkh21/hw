
var url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
var citiesArr =[],
    sorted = [];
function getCityList(url){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.addEventListener('load', function(){
          resolve(xhr.responseText);
        });
        xhr.addEventListener('error', function(){
            reject();
        });

    });
};

var btn = document.getElementById('btn');
document.addEventListener('DOMContentLoaded', function (){
    getCityList(url)
        .then(function(result){
            var cities = JSON.parse(result);
            for(var i = 0;  i < cities.length; i++){

                citiesArr.push(cities[i].name);

            }
            citiesArr.sort();
           console.log(citiesArr);

        });
});
var input = document.getElementById('city');
var list  = document.getElementById('list');
input.addEventListener('click', function (e) {
    if(input.value === 'Введите название города')
            input.value = '';
})
input.addEventListener('keyup', function(e){
    console.log(input.value);
    //if(!input.value) return;
    sorted =   citiesArr.filter(function (value) {
         if(value.toLowerCase().indexOf(input.value.toLowerCase()) != -1) return true;
    });
    list.classList.remove('close');
    list.classList.add('open');
    list.innerHTML = sorted.join('<br>');

});