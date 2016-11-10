var allNumbers = [1, 2, 4, 5, 6, 7, 8],

    someNumbers = [1, 2, 'привет', 4, 5, 'loftschool', 6, 7, 8],

    noNumbers = ['это', 'массив', 'без', 'чисел'],
    empty = [];

function isNumber(val) {

    return typeof val === 'number';

}

/*Вторая функция*/
function isSomeTrue(source, filterFn) {
    var result = 0;
    if(!source.length){
        console.error('Пустой массив') ;
        return false;
    }
    for(var i = 0; i< source.length; i++){
        if(filterFn(source[i]) === true) {
            return true;
        }
    }
    return false;
  }
console.log(isSomeTrue(allNumbers, isNumber)); //вернет true
console.log(isSomeTrue(someNumbers, isNumber)); //вернет true
console.log(isSomeTrue(noNumbers, isNumber)); //вернет false