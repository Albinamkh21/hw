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

    prop6: new Date('2016/03/10'),
    prop4: {

        subProp2: {

            subSubProp1: 'sub sub value1',

            subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5]

        },

        subProp1: 'sub value1'

    },
    prop7 : [1,2,3]

};
function CheckProperties(objA, objB ){
    var count = 0;
    for(let key in objA){
        if(key in objB){
            count++;
        }
        else return 0;

    };
    return count;
}
function deepEqual(objA, objB)
{
    var countA = 0,
        countB = 0,
        countValue = 0;
    /*Проверка идентичности свойств*/
    countA =  CheckProperties(objA, objB);
        //console.log(countA);
    countB =  CheckProperties(objB, objA);
    //console.log(countB);
    /*Проверка идентичности значения свойств*/
    if(countA == countB){
        for(let key in objA){
            if(typeof objA[key] === 'string' || typeof objA[key] === 'boolean' || (typeof objA[key] === 'number' && !isNaN(objA[key])) || typeof objA[key] ===  'undefined'  ) {
                if (objA[key] === objB[key]) {
                    countValue++;
                }
            }
            else if(objA[key] instanceof Date ){
               if(objA[key].getTime() == objB[key].getTime()) {
                           countValue++;
               }
            }
            else if((Array.isArray(objA[key])) || (objA[key] instanceof Object)){
                if(deepEqual(objA[key], objB[key]))
                    countValue++;
            }

        };

    };
    //console.log(objA.constructor.name +' = ' + objB.constructor.name + '. Количество свойств :' + countValue);
    if(countValue == countB) {
        return true;
    };
    return false;
};

console.log(deepEqual(objA, objB));







