import ShortcutWidget  from './Components/Shortcut.widget'
import TodoSection  from './Components/Todo.widget'
import TextWidget  from './Components/Text.widget'

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