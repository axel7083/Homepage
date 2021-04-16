/*global chrome*/
import React from "react";
import ShortcutWidget from "./Shortcut.widget";

const favURL = "chrome://favicon/size/64@1x/"

export default class History extends ShortcutWidget {

    constructor(props) {
        super(props);

        this.setRecentlyVisited = this.setRecentlyVisited.bind(this);
    }

    componentDidMount() {
        console.log("History state:");
        this.setRecentlyVisited();
    }

    setRecentlyVisited()
    {
        chrome.history.search({text: '', maxResults: 50}, function(data) {
            let shortcuts = [];
            data.forEach(function(page) {

                let url = new URL(page.url);
                if(!page.url.includes("chrome-extension:") && shortcuts.length < 5)
                {
                    let shouldAdd = true;
                    shortcuts.forEach((item) => {
                        if(new URL(item.url).hostname === url.hostname)
                            shouldAdd = false;
                    })

                    if(shouldAdd)
                        shortcuts.push({
                            src: favURL+page.url,
                            url: page.url,
                            customName: page.title
                        })
                }


            });

            this.setState({allowManualAdding:false,shortcut:shortcuts});
        }.bind(this));
    }

    render(): * {
        return super.render();
    }

}