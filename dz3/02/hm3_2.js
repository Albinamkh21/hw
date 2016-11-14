var objA = {

    prop1: 'value1',

    prop2: 'value2',

    prop3: 'value3',
    prop7 : [1,2,3],
    prop4: {

        subProp1: 'sub value1',

        subProp2: {

            subSubProp1: 'sub sub value1',

            subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5]

        }

    },
    prop5: 1000,
    prop6: new Date(2016, 2, 10)

};
var objB = {

    prop5: 1000,

    prop3: 'value3',

    prop1: 'value1',

    prop2: 'value2',

    prop6: new Date(2016, 2, 10), //new Date('2016/02/10'),
    prop4: {

        subProp2: {

            subSubProp1: 'sub sub value1',

            subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5]

        },

        subProp1: 'sub value1'

    },
    prop7 : [1,2,3]

};

function deepEqual(objA, objB)
{
    var countA = 0,
        countB = 0,
        countValue = 0;
    /*Проверка идентичности свойств*/
    for(let key in objA){
        if(key in objB){
        }
        else return false;
        countA++;
    };
    //console.log(countA);

    for(let key in objB){
       if(key in objA){
        }
        else return false;
        countB++;
    };
    //console.log(countB);
    /*Проверка идентичности значения свойств*/
    if(countA == countB){
        for(let key in objA){
            if(typeof objA[key] === 'string' || typeof objA[key] === 'boolean' || typeof objA[key] === 'number' || typeof objA[key] ===  'undefined'  ) {
                if (objA[key] === objB[key]) {
                    countValue++;
                }
            }
            else if(objA[key] instanceof Date ){
               if(+objA[key].valueOf() == +objB[key].valueOf()) {
                           countValue++;
               }
            }
            else if((objA[key] instanceof Array) || (objA[key] instanceof Object)  ){
                if(deepEqual(objA[key], objB[key]))
                    countValue++;
            }

        };

    };
    console.log(objA.constructor.name +' = ' + objB.constructor.name + '. Количество свойств :' + countValue);
    if(countValue == countB) {
        return true;
    };
    return false;
};

console.log(deepEqual(objA, objB));





