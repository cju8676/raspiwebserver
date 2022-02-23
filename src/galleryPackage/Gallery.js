import React, { Component } from 'react'
import { Card, Search, Divider, Header } from 'semantic-ui-react'

import ImagePane from '../imagePackage/ImagePane'
import UploadFileModal from './UploadFileModal'
import SearchBar from '../SearchBar'


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            albums: [],
            currentUser: props.user,
            uploadFile : false,
            refresh : props.onRefresh,
            cards: props.img 
        }
    }

    //fixme maximum update depth exceeded
    searchResults = (result) => {
        console.log(result);
        // if (result === null) {
        //     this.setState({cards: this.props.img.map(picture => picture)})
        // }
        // else {
        //     this.setState({cards: this.props.img.map(picture => picture)[0]})
        // }
    }

    // componentDidMount() {
    //     this.setState({ cards : this.props.img.map(picture => picture)})
    // }

    render() {
        return (
            <div>
                <div>
                    <Header as='h3' size='small '>
                        <UploadFileModal onRefresh={this.state.refresh}/>
                        <SearchBar onChange={this.searchResults}/>
                    </Header>
                </div>
                <Divider />
                <div>
                    <Card.Group itemsPerRow={4}>
                        {/* {this.state.cards} */}
                        {this.props.img.map(picture => picture)}
                    </Card.Group>
                </div>
            </div>
        )
    }
}

export default Gallery;