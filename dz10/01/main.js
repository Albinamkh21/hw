/*es6*/
class Calculator {
    constructor(firstNumber) {
        this.firstNumber = firstNumber;
    }

        sum() {
            var result = 0;
            for (var i = 0; i < arguments.length; i++) {
                result += arguments[i];
            }
            return this.firstNumber + result;
        }
        dif() {
            var result = 0;
            for (var i = 0; i < arguments.length; i++) {
                result += arguments[i];

            }
            return this.firstNumber - result;
        }
        div() {
            var result = this.firstNumber;
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
        }
        mul()  {
            var result = this.firstNumber;
            for (var i = 0; i < arguments.length; i++) {
                result *= arguments[i];

            }
            return result;
        }
}

class SqlCalculator extends Calculator {
    sum(){
        return Math.pow(super.sum(...arguments),2);
    }
    dif(){
        return Math.pow(super.dif(...arguments),2);
     }
    div(){
    return Math.pow(super.div(...arguments),2);
    }
    mul(){
    return Math.pow(super.mul(...arguments),2);
    }

}
let myCalculator = new SqlCalculator(100);
console.log(myCalculator.sum(1, 2, 3)); //вернет 11 236 (100 + 1 + 2 + 3 = 106 * 106)
console.log(myCalculator.dif(10, 20)); //вернет 4 900
console.log(myCalculator.div(2, 2)); //вернет 625
console.log(myCalculator.mul(2, 2)); //вернет 160 000

let calc = new Calculator(100);
console.log(calc.sum(1, 2, 3));

/*es5*/
console.log('-- ES5 --');
function Calculator2(firstNumber) {

    this.firstNumber = firstNumber;

}

Calculator2.prototype.sum = function () {

        var result = 0;
        for (var i = 0; i < arguments.length; i++) {
            result += arguments[i];
        }
        return this.firstNumber + result;
};
Calculator2.prototype.dif = function () {
    var result = 0;
    for (var i = 0; i < arguments.length; i++) {
        result += arguments[i];

    }
    return this.firstNumber - result;
};
Calculator2.prototype.div = function () {
        var result = this.firstNumber;
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
};
Calculator2.prototype.mul = function () {
        var result = this.firstNumber;
        for (var i = 0; i < arguments.length; i++) {
            result *= arguments[i];

        }
        return result;
};


function  SqlCalculator2(firstNumber){
    this.firstNumber = firstNumber;

}
SqlCalculator2.prototype = Object.create(Calculator2.prototype);
SqlCalculator2.prototype.sum = function () {

        return Math.pow(Calculator2.prototype.sum.apply(this, arguments),2);
};
SqlCalculator2.prototype.dif = function () {
        return Math.pow(Calculator2.prototype.dif.apply(this, arguments),2);
};
SqlCalculator2.prototype.div = function () {
        return Math.pow(Calculator2.prototype.div.apply(this, arguments),2);
};
SqlCalculator2.prototype.mul = function () {
        return Math.pow(Calculator2.prototype.mul.apply(this, arguments),2);
};

let myCalculator2 = new SqlCalculator2(100);
console.log(myCalculator2.sum(1, 2, 3)); //вернет 11 236 (100 + 1 + 2 + 3 = 106 * 106)
console.log(myCalculator2.dif(10, 20)); //вернет 4 900
console.log(myCalculator2.div(2, 2)); //вернет 625
console.log(myCalculator2.mul(2, 2)); //вернет 160 000

let calc2 = new Calculator2(100);
console.log(calc2.sum(1, 2, 3));



