/*global chrome*/
import React, {Component} from "react";
import { Card , Container ,Col ,Image, Modal, Button,CardColumns,Spinner} from 'react-bootstrap';
import {createClient} from "pexels";

const queries = [
    {name:"Nature",items:["Landscape","Forest","Flowers","Sky","Mountain","Cave"]},
    {name:"Marine Life",items:["Underwater","Fish","Coral Reef","Ocean","Sea"]},
    {name:"Animals",items:["Birds","Dogs","Cats","Lion","Horse","Tiger"]},
]

const TAG = "Gallery";

export default class Gallery extends Component {

    constructor(props) {
        super(props);

        //this.fetchCollections = this.fetchCollections.bind(this);
        this.onCollectionSelected = this.onCollectionSelected.bind(this);
        this.fetchRecursive = this.fetchRecursive.bind(this);

        this.state = {
            text:"",
            collections:[],
            spinning:true,
            error:"",
        }


    }

    componentDidMount() {
        console.log("Loading data from storage");
        if(chrome.storage !== undefined) {
            chrome.storage.local.get(TAG, function (items) {
                //console.log("Data: " + JSON.stringify(items));
                if(items[TAG] === undefined) {
                    this.fetchRecursive(0,0);
                    return;
                }
                console.log("Setting state from storage");
                this.setState({collections:items[TAG].collections,spinning:false,selected:items[TAG].selected})
            }.bind(this));

        }
        else
        {
            console.log("Debugging");
            this.setState({error:"Not available outside chrome extension mode.",spinning:false})
        }
    }

    fetchRecursive(i = -1, j = -1)
    {
        const client = createClient('563492ad6f91700001000001c3951a9a512740f593c60a433aa03598');

        if(i === queries.length)
        {
            console.log("Final one reached");

            if(this.state.collections.length === 0)
            {
                this.setState({error:"Error getting the images.",spinning:false});
            }
            else
            {
                this.setState({spinning:false});
            }
            return;
        }

        const val = queries[i].items[j];
        console.log("(" + i + ":" + j +")Searching for " + val);

        if(this.state.collections.length <= i)
            this.state.collections.push({name:queries[i].name,items:[]});

        client.photos.search({ query:val, per_page: 20 }).then((res) => {
            if(res.error !== undefined)
            {
                throw new Error(res.error);
            }
            this.state.collections[i].items.push({photos:res.photos,query:val});

            if(j === queries[i].items.length-1) {
                i++;
                j = 0;
            }
            else
                j++;
            this.fetchRecursive(i,j);
        }).catch(e => {
            this.setState({error:"[Error] " + e,spinning:false,collections:[]});
        })
    }

    onCollectionSelected(i,j)
    {
        if(!this.state.collections[i])
            return;

        if(!this.state.collections[i].items[j])
            return;

        console.log("Security check finish");


        console.log("Selected: " + this.state.collections[i].name + "->" + this.state.collections[i].items[j].query);
        this.setState({selected:this.state.collections[i].items[j]});
        chrome.storage.local.set({ [TAG]: {collections:this.state.collections,selected:this.state.collections[i].items[j]}}, function(){
            //  Data's been saved boys and girls, go on home
            console.log("Saved!");
        });
    }


    render() {
        return (
            <Container>
                {this.state.spinning?<Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>: this.state.error}
                {this.state.collections.map((item,i) => {
                    return <div><h5>{item.name}</h5>
                        <CardColumns>
                            {item.items.map((elem,j) => {
                                return <Card border={(this.state.selected?.query === elem?.query)?"success":"dark"}>
                                    <a href="#" onClick={() => this.onCollectionSelected(i,j)}><Card.Img variant="top" src={elem.photos?elem.photos[0].src.landscape:""}/>
                                        <Card.Footer>
                                            <small className="text-muted">{elem?.query}</small>
                                        </Card.Footer></a>
                                </Card>
                            })}
                        </CardColumns>
                    </div>
                })}
            </Container>
        );
    }
}