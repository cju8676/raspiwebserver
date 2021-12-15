import React, { Component } from 'react'
//import {Image} from 'semantic-ui-react'

import ImagePane from './ImagePane'


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.user,
            pictures: []
        }
    }

    fetchPictures = () => {
        fetch('/getAllImages/')
            .then(
                response => response.blob()
            ).then(imageBlob => {
            const imageURL = URL.createObjectURL(imageBlob);
            this.setState({pictures:[imageURL]})
        })
        console.log(this.state.pictures)
    }

    displayPics = (picture) => {
        return (<ImagePane src={picture}></ImagePane>);
    }

    componentDidMount() {
        this.fetchPictures()
    }

    render() {

        return (
            <div>
                {this.state.pictures.map(pictures => {
                    return <ImagePane pictures={pictures}/>
                })}
            </div>
        )
    }
}

export default Gallery;