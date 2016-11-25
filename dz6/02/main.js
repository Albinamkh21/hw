var url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

function getCityList(url){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        console.log('в промисе');
        xhr.addEventListener('load', function(){
            console.log('loaded');

            resolve(xhr.responseText);

        });
        xhr.addEventListener('error', function(){
            reject();
        });

    });
};


var btn = document.getElementById('btn');
btn.addEventListener('click', function (){
    getCityList(url)
        .then(function(result){
            var cities = JSON.parse(result);
            var arr = [];

            for(var i = 0;  i < cities.length; i++){
                arr.push(cities[i].name);

            }
            arr.sort();
            container.innerHTML  = arr.join('<br>');

        });
});
