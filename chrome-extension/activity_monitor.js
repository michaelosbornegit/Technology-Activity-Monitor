console.log("hello, world!");

console.log('this is a test!');

console.log(chrome.tabs);

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    console.log(tabs[0].url);
    console.log(tabs[0].title);
});



let acceptingMouseMoves = true;

document.addEventListener('mousemove', e => {
    if (acceptingMouseMoves) {
        chrome.runtime.sendMessage({
            activityDetected: true
        })
        acceptingMouseMoves = false;
        new Promise(accept => setTimeout(() => {
            acceptingMouseMoves = true;
            accept();
        }, 2000))
    }
});