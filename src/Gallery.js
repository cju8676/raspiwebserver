import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'

import ImagePane from './ImagePane'


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: props.user,
            link_name_id: [],
            name_path_id: [],
        }
    }

    fetchPictures = () => {
        fetch('/getAllImages/').then(response => response.json())
            .then(JSONresponse => {
                this.setState({ name_path_id: JSONresponse })
                console.log(this.state)
                for (let i = 0; i < this.state.name_path_id.length; i++) {
                    //FIXME for some reason it doesn't like encoding / so i do it manually
                    var path = (this.state.name_path_id[i][1]).replace('/', '%2F');
                    //fixme could change this to just the id to simplify
                    fetch('/files/' + encodeURIComponent(path) + '/' + encodeURIComponent(this.state.name_path_id[i][0]))
                        .then(response => response.blob())
                        .then(imageBlob => {
                            const imageURL = URL.createObjectURL(imageBlob);
                            //this.setState({pictures:[imageURL]})})
                            this.setState(prevState => ({
                                link_name_id: 
                                [...prevState.link_name_id, [imageURL, this.state.name_path_id[i][0], this.state.name_path_id[i][2]]]
                            }));
                        })
                }
            })
    }

    componentDidMount() {
        //FIXME if photos are already loaded then switching tabs shouldn't reset this
        this.fetchPictures();
    }

    render() {

        return (
            <div>
                {console.log(this.state)}
                <Card.Group itemsPerRow={4}>
                    {this.state.link_name_id.map(picture => {
                        return <ImagePane picture={picture[0]} filename={picture[1]} id={picture[2]} user={this.state.currentUser}/>
                    })}
                </Card.Group>
            </div>
        )
    }
}

export default Gallery;