import React, { Component } from 'react'
import { Card, Search, Divider, Header } from 'semantic-ui-react'

import ImagePane from '../imagePackage/ImagePane'
import UploadFileModal from './UploadFileModal'


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            albums: [],
            currentUser: props.user,
            uploadFile : false,
            refresh : props.onRefresh,
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Header as='h3' size='small '>
                        <UploadFileModal onRefresh={this.state.refresh}/>
                        <Search />
                    </Header>
                </div>
                <Divider />
                <div>
                    <Card.Group itemsPerRow={4}>
                        {this.props.img.map(picture => picture)}
                    </Card.Group>
                </div>
            </div>
        )
    }
}

export default Gallery;