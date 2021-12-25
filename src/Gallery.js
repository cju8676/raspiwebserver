import React, { Component } from 'react'

import ImagePane from './ImagePane'


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.user,
            pictures: [],
            namepath: []
        }
    }

    fetchPictures = () => {
        fetch('/getAllImages/').then(response => response.json())
            .then(JSONresponse => {
                this.setState({ namepath: JSONresponse })
                console.log(this.state)
                for (let i = 0; i < this.state.namepath.length; i++) {
                    //FIXME for some reason it doesn't like encoding / so i do it manually
                    var path = (this.state.namepath[i][1]).replace('/', '%2F');
                    fetch('/files/' + encodeURIComponent(path) + '/' + encodeURIComponent(this.state.namepath[i][0]))
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            //this.setState({pictures:[imageURL]})})
                            this.setState(prevState => ({
                                pictures: [...prevState.pictures, imageURL]
                            }));
                        })
                }
                console.log(this.state)
            })

    }

    componentDidMount() {
        //FIXME if photos are already loaded then switching tabs shouldn't reset this
        this.fetchPictures();
    }

    render() {

        return (
            <div>
                {this.state.pictures.map(picture => {
                    return <ImagePane picture={picture} />
                })}
            </div>
        )
    }
}

export default Gallery;