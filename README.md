# HomePage

![homepage](https://github.com/axel0070/Homepage/blob/main/Screenshots/Example.png)

A chrome extension which provide a nice customizable Homepage.

## Widgets
 
![homepage](https://github.com/axel0070/Homepage/blob/main/Screenshots/EditMode.PNG)

This page is using `Widgets`, you can move them as you want, where you want.
 
## Shortcuts
 
You can directly go/open this page using Ctrl+Q anywhere in your browser. No need to lose time searching where is the right tab.
  
## Wallpaper

I like to have beautiful and nice wallpaper, therefore I decided to use the [Pexels](https://www.pexels.com/) website, and they API to display nice background by themes.

The user can choose between themes available, and differents images will be displayed related to the selected theme.

## Todo
 
Some future widgets I will implement:
- Clock
- Session saving (All the tabs open save them and restore them later)
 
## Creating widgets

Every widget component must extend the [widget](https://github.com/axel0070/Homepage/blob/main/src/Widget.js) class, which provide some functions to allow loading and saving the state of the widget from local storage.

#### Load saved State
```javascript
//Can be called anytime (Preference in constructor)
this.loadState((isEmpty) => {
    if(isEmpty)
        //Stuff to do if the saved state is undefined
    else
        //Stuff to do if the saved state is not undefined
});
```

#### Saving current State
```javascript
//Can be called anytime (Avoid in loops)
this.saveState(() => {
        console.log("State saved.");
    });
```

#### Edit mode Listener
You can have a listener to be notify when the editor is switching on/off.
```javascript
//Can be called anytime (Preference inside loadState callback)
this.setState({OnEditorChangeListener:(value) => {
    if(value)
        //Stuff to do when edit mode switch on
    else
        //Stuff to do when edit mode switch off
}});
```
