import React, { Component } from 'react'

import ImagePane from './ImagePane'


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.user,
            pictureLinks: [],
            linksAndNames: [], //FIXME prob a better way of doing this
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
                                pictureLinks: [...prevState.pictureLinks, imageURL],
                                linksAndNames: [...prevState.linksAndNames, [imageURL, this.state.namepath[i][0]]]
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
                {this.state.linksAndNames.map(picture => {
                    return <ImagePane picture={picture[0]} filename={picture[1]}/>
                })}
            </div>
        )
    }
}

export default Gallery;