/*Третья функция*/
function calculator(firstNumber) {

    var obj = {
        sum: function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i++) {
                result += arguments[i];
            }
            return firstNumber + result;
        },
        dif: function () {
            var result = 0;
            for (var i = 0; i < arguments.length; i++) {
                result += arguments[i];

            }
            return firstNumber - result;
        },
        div: function () {
            var result = firstNumber;
            for (var i = 0; i < arguments.length; i++) {
                if(arguments[i] == 0) {
                    console.error('Деление на ноль.');
                    return 0;
                }
                else {
                    result /= arguments[i];
                }

            }
            return result;
        },
        mul: function () {
            var result = firstNumber;
            for (var i = 0; i < arguments.length; i++) {
                result *= arguments[i];

            }
            return result;
        }
    };
    return obj;
}

var myCalculator = calculator(100);
console.log(myCalculator.sum(1, 2, 3)); //вернет 106
console.log(myCalculator.dif(10, 20)); //вернет 70
console.log(myCalculator.div(2, 0)); //вернет 25
console.log(myCalculator.mul(2, 2)); //вернет 400
