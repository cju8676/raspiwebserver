import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'

class ImagePane extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display : false,
            name: props.filename,
            picture: props.picture
        }
    }

    

    render() {
        return (
            <div className='imgPane'
            onMouseEnter={e => this.setState({display: true})}
            onMouseLeave={e => this.setState({display: false})}>
            <img src={this.state.picture} alt="pic" />
            <a href={this.state.picture} download={this.state.name}>
            {this.state.display && <Button type="submit" ><Icon name='world'/></Button>}
            </a>
            </div>
        )
    }
}
export default ImagePane
