/*global chrome*/
import {Component} from "react";

export default class Widget extends Component {

    constructor(props) {
        super(props);

        this.getUUID = this.getUUID.bind(this);
        this.saveState = this.saveState.bind(this);
        this.loadState = this.loadState.bind(this);

        if(!this.props.UUID)
            throw new Error("The component must have an UUID.");
        else
        {
            console.log(this.props.UUID);
        }

    }

    getUUID() {
        return this.props.UUID;
    }

    saveState(callback = undefined) {
        chrome.storage.local.set({ [this.getUUID()]: this.state}, function(){
            if(callback !== undefined)
                callback();
        });
    }

    componentDidUpdate(prevProps,prevState) {


        if(prevProps.editor !== this.props.editor)
        {
            //console.log("editor state change to " + this.props.editor);

            if(this.state.OnEditorChangeListener)
            {
                this.state.OnEditorChangeListener(this.props.editor);
            }
        }
    }

    loadState(callback = undefined) {
        chrome.storage.local.get(this.getUUID(), function (items) {

            let state = items[this.getUUID()];
            if(state === undefined || state === null) {
                if(callback !== undefined)
                    callback(true);
            }
            else
            {
                this.setState(items[this.getUUID()],() => {
                    if(callback !== undefined)
                        callback(false);
                });
            }

        }.bind(this));
    }

}
