/*global chrome*/
import ShortcutWidget  from './Components/Shortcut.widget'
import TodoSection  from './Components/Todo.widget'
import ClockWidget  from './Components/Clock.widget'
import TextWidget  from './Components/Text.widget'
import HistoryWidget  from './Components/History.widget'

export const toDataUrl = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

export const extractHostname = (url) => {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.replace("www.","");
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

export const getComponentByID = (id) => {
    switch (id) {
        case 0:
            return ShortcutWidget;
        case 1:
            return TodoSection;
        case 2:
            return TextWidget;
        case 3:
            return ClockWidget;
        case 4:
            return HistoryWidget;
        default:
            return undefined;
    }
}

export const randomIntFromInterval = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Cahce all the images but return the first one.
export const cachingImage = (urls,callback) =>
{
    let callbackUsed = false;
    let images = new Array()
    for (let i = 0; i < urls.length; i++) {
        console.log("Caching " + i + "/" + urls.length);
        images[i] = new Image();
        images[i].onload = function () {
            console.log("Cached " + i + "/" + urls.length);

            if(!callbackUsed) {
                callback(i);
                callbackUsed = true;
            }
        }
        images[i].src = urls[i]
    }

}

export const convertRemToWidthPercentage = (rem) => {
    const width = window.innerWidth;
    const pixel = rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

    return (pixel/width)*100;
}

export const RemToPixel = (rem) =>
{
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export const exportAllData = (widgets,callback) =>
{
    let output = [];
    let count = 0;
    //First create an array of all the name of element which we need to take from the local storage.

    let array = ["home","Gallery",];
    widgets.forEach((item,i) => {
        array.push(item.UUID);
    })

    console.log(array);

    array.forEach((item,i) => {
        chrome.storage.local.get(item, function (res) {

            count++;
            if(!res[item])
                return;

            output.push(res);

            if(count >= array.length-1)
            {
                console.log("Callback");
                callback(output);
            }
        });
    })
}