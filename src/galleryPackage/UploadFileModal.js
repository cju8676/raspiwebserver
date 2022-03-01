import React, { Component } from 'react'
import { Modal, Button, Form, Container, Header, Divider, Image } from 'semantic-ui-react'
import Tags from '../imagePackage/Tags';
import PeopleTags from '../imagePackage/PeopleTags';

class UploadFileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFile: false,
            refresh: props.onRefresh,
            picture: false
        }
        // this.picture = false;
    }

    toggleUpload = () => { 
        this.setState({ uploadFile: !this.state.uploadFile })
    }

    handleUploadImage = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", this.uploadInput.files[0]);
        fetch('/uploadPic', {
            method: 'POST',
            body: data
        })
            .then(response => response.text())
            .then(data => {
                console.log(data)
                this.setState({ uploadFile: !this.state.uploadFile });
                this.state.refresh();
            })
    }

    handleSubmit = () => {
        this.setState({ uploadFile: !this.state.uploadFile })
        this.state.refresh();
    }

    render() {
        return (
            <div>
                <Modal
                    open={this.state.uploadFile}
                    trigger={<Button className="rightButton" onClick={this.toggleUpload} color='orange' size='large' >Upload</Button>}>
                    <Modal.Header>New File Upload</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleUploadImage}>
                            <Container>
                                <Header>Select File</Header>
                                <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                                <Button as='a' onClick={() => console.log(this.uploadInput.files.length)}>Check</Button>
                                <Container>
                                    {this.picture && <Image src={this.uploadInput.files[0]} alt={"picture"} /> }
                                </Container>
                            </Container>
                            <Container>
                                <Tags id={'-2'}/>
                            </Container>
                            <Container>
                                <PeopleTags id={'-2'}/>
                            </Container>
                            <Divider />
                            <Button as='a' onClick={this.toggleUpload}>Cancel</Button>
                            <Button type='submit' positive >Submit</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }

}
export default UploadFileModal;