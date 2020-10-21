/*global chrome*/
chrome.browserAction.onClicked.addListener(function(tab) {
    open();
});

chrome.commands.onCommand.addListener(function (command) {
    if (command === "open") {
        open();
    }
});


function open()
{
    chrome.tabs.query({}, function (tabs) {
        let found = false;
        for (var i = 0; i < tabs.length; i++) {
            if(tabs[i].url.includes("chrome-extension://") && tabs[i].url.includes("index.html"))
            {
                found = true;
                chrome.tabs.update(tabs[i].id, {selected: true});
                break;
            }
        }
        if(!found)
            chrome.tabs.create({url:'index.html'});
    });
}