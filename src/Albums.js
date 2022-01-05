import React, { Component } from 'react'
import { Card, Icon } from 'semantic-ui-react'

//import ImagePane from './ImagePane'

class Albums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.user
        }
    }


    render() {
        return (
            <div>
                <Card.Group itemsPerRow={4}>
                    <Card>
                        <Icon name='add' />
                        Create New Album 
                    </Card>
                </Card.Group>
            </div>
        )
    }

}
export default Albums;