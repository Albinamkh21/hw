var allNumbers = [1, 2, 4, 5, 6, 7, 8],

    someNumbers = [1, 2, 'привет', 4, 5, 'loftschool', 6, 7, 8],

    noNumbers = ['это', 'массив', 'без', 'чисел'],
    empty = [];

function isNumber(val) {

    return typeof val === 'number';

}
/*Первая функция*/
function isAllTrue(source, filterFn) {
    var result = 0;
    if(!source.length){
        console.error('Пустой массив') ;
        // throw 'Пустой массив';
        return false;
    }
    for(var i = 0; i< source.length; i++){
        if(filterFn(source[i])=== true) result++;
    }
    if(result === source.length) return true;
    else return false;

}
console.log(isAllTrue(allNumbers, isNumber)); //вернет true
console.log(isAllTrue(someNumbers, isNumber)); //вернет false
console.log(isAllTrue(noNumbers, isNumber)); //вернет false
//console.log(isAllTrue(empty, isNumber)); //вернет false