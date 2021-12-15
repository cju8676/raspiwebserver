import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'

class ImagePane extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display : false,
            picture: props.pictures
        }
    }

    render() {
        return (
            <div className='imgPane'
            onMouseEnter={e => this.setState({display: true})}
            onMouseLeave={e => this.setState({display: false})}>
            <img src={this.state.picture} alt="pic" />
            {this.state.display && <Button><Icon name='world'/></Button>}
            </div>
        )
    }
}
export default ImagePane
