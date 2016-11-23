/**
 * Created by Albina on 23-Nov-16.
 */
function timer(time){
    return new Promise(function(resolve,reject) {
        var timerId = setTimeout(function () {
            resolve();
        }, time);
    });
    
}
timer(3000).then(() => console.log('я вывелась через 3 секунды'));
timer(1000).then(() => console.log('я вывелась через 1 секунды'));