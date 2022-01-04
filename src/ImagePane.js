import React, { Component } from 'react'
import { Button, Icon, Card, Image } from 'semantic-ui-react'

class ImagePane extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display : false,
            name: props.filename,
            picture: props.picture,
            favorited: props.favorited,
            id : props.id
        }
    }

    favorite = () => {
        const data = {
            username : this.props.user,
            id : this.state.id
        }
        const reqOptions = {
            method: 'POST',
            headers: {Accept:'application/json', 'Content-Type':'application/json'},
            body: JSON.stringify(data)
        }
        if (this.state.favorited) {
            this.setState({favorited : false})
            // delete where user and picture id
            const getUrl = '/removeFav/' + this.props.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
        else {
            this.setState({favorited : true})
            //fixme post user and picture id
            const getUrl = '/addFav/' + this.props.user + '/' + this.state.id
            fetch(getUrl, reqOptions)
                .then(response => response.json())
                .then(this.fetchData)
        }
    }

    render() {
        // return (
        //     <div className='imgPane'
        //     onMouseEnter={e => this.setState({display: true})}
        //     onMouseLeave={e => this.setState({display: false})}>
        //     <img src={this.state.picture} alt="pic" />
        //     <a href={this.state.picture} download={this.state.name}>
        //     {this.state.display && <Button type="submit"><Icon name='download'/></Button>}
        //     </a>
        //     {this.state.display && <Button><Icon name='favorite'/></Button>}
        //     </div>
        // )
        return (
        <Card
            onMouseEnter={e => this.setState({display: true})}
            onMouseLeave={e => this.setState({display: false})}>
            <Image src={this.state.picture} alt="pic"/>    
            <Card.Content>
                <a href={this.state.picture} download={this.state.name}>
                    {/*this.state.display &&*/ <Button type="submit"><Icon name='download' />Save</Button>}
                </a>
                <Button onClick={this.favorite}>
                    {!this.state.favorited && <Icon name='favorite' />}
                    {this.state.favorited && <Icon name='favorite' color='yellow' />}
                    Favorite
                    </Button>
                <Button><Icon name='add'/>Add to Album</Button>
                <Button><Icon name='info' /></Button>
            </Card.Content>
        </Card>
        )
    }
}
export default ImagePane
