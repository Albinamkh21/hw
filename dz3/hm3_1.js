/*
 ДЗ - 1:

 написать аналоги методов для работы с массивами:

 forEach, filter, map, slice, reduce, splice
 */


var arr = ["Яблоко", "Апельсин", "Груша"];
/*1.forEach*/
console.info('-- forEach --');
function writeItem(item)
{
    console.log(item);
}
function forEach(arr, fn) {
    for(var i = 0; i < arr.length; i++)
    {
        fn(arr[i]);
    }

};
forEach(arr,item => console.log(item));


/*2.Filter*/
console.info('-- filter --');
var arr2 = [1, -1, 2, -2, 3];
var positiveArr = arr2.filter(function(number) {
    return number > 0;
});
console.log( positiveArr ); // 1,2,3

function positiveArray(number) {
    return number > 0;
}
function filter(arr, fn){
    var resArr = [];
    for(var i = 0; i < arr.length; i++)
    {
        if(fn(arr[i]) == true) resArr.push(arr[i]);
    }
    return resArr;

};
console.log(filter(arr2, number => {return number > 0;}) );


/*3.map*/
console.info('-- map --');
var names = ['HTML', 'CSS', 'JavaScript'];
function map(arr, fn){
    var resArr = [];
    for(var i = 0; i < arr.length; i++)
    {
        resArr.push(fn(arr[i]));
    }
    return resArr;

};
console.log(map(names, item => {return item.length}) );
console.log(map(names, function(item){ return item.toString().toLowerCase();}) );


/*4. slice*/
console.info('-- slice --');
var arr = [1,2, 3, 4, 5,6];
function slice(arr, begin, end){
  //  console.log(arr);
    var resArr = [];
    if(begin == undefined) begin = 0;
    else if(begin < 0) { begin = arr.length+begin;  }
    if(end == undefined) end = arr.length;
    else if(end < 0 ) end = arr.length+end;
    if(begin > end){
        console.log('Начальная позиция должна быть больше конечной.');
        return [];
    };

    for(var i = begin; i < end; i++)
    {
        resArr.push(arr[i]);
    }
    return resArr;

};

console.log(arr.slice());
console.log(slice(arr));
console.log(arr.slice(-2)); // 5, 6
console.log(slice(arr,-2)); // 5, 6
console.log(arr.slice(2,-2)); //3, 4,
console.log(slice(arr,2,-2)); //3, 4,
console.log(slice(arr,0,5)); //3, 4,

/*5.reduce*/
console.info('-- reduce --');
var arr = [1,2, 3, 4, 5,6];

function reduce(arr, fn, prev){
    var result = prev;
    for(var i = 0; i < arr.length; i++)
    {
        if(!result) result = 0;
        result = fn(result,arr[i]);
    }
    return result;

};
console.log(reduce(arr,function sum(prev, cur) {
     return prev+cur;
}));

console.log(reduce(arr,function concat(prev, cur) {
    return prev+ ',' + cur;
},10));

/*6.splice*/
console.info('-- splice --');
var arr = [1,2, 3, 4, 5,6,7,8
];
function splice(arr, start = 0,  deleteCount = 0){
    var resArr = [],
        removedArr = [],
        k = 0;
    if(start > arr.length) start  = arr.length;
    else if(start < 0) start  = arr.length+start;

    for(let i = 0; i < start+deleteCount; i++)
    {
        if(i < start){
            //resArr.push(arr[i]);
            resArr[k] = arr[i];
            k++;
        }
        else
            removedArr.push(arr[i]);

    }
    if(arguments.length > 3){
        for(let i = 3; i < arguments.length; i++){
            resArr[k] = arguments[i];
            k++;
        }

    }
    for(let i = start+deleteCount; i < arr.length; i++)
    {
        //resArr.push(arr[i]);
        resArr[k] = arguments[i];
        k++;
    }

    arr = resArr;
    return removedArr;
}
console.log(splice(arr,2,2));
console.log(arr.splice(2,2));
 console.log(arr);
/*
console.log(splice(arr,2,3,101,102)); //3, 4,
console.log(arr.splice(2,3,101,102)); //3, 4,
console.log(arr);
*/


