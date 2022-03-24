import React, { Component } from 'react'
import { Modal, Button, Form, Container, Header, Divider, Image, Tab } from 'semantic-ui-react'
import Tags from '../imagePackage/Tags';
import People from '../imagePackage/People';

class UploadFileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFile: false,
            refresh: props.onRefresh,
            file: null,
            files: []
        }
        this.handleChange = this.handleChange.bind(this)
    }

    toggleUpload = () => {
        this.setState({ uploadFile: !this.state.uploadFile })
        this.setState({ file: null })
        this.setState({ files: [] })
        this.deleteUploadTags();
    }

    deleteUploadTags = () => {
        fetch('/deleteUploadTags/', {
            method: 'POST'
        }).then(res => res.text()).then(data => console.log(data))
    }

    handleUploadFolder = (e) => {
        e.preventDefault();
        console.log(this.uploadInput.files)
        for (var i = 0; i < this.uploadInput.files.length; i++) {
            const data = new FormData();
            data.append("file", this.uploadInput.files[i])
            fetch('/uploadPic', {
                method: 'POST',
                body: data
            })
                .then(res => res.text())
                .then(data => {
                    console.log(data)
                })
        }
        this.setState({ uploadFile: !this.state.uploadFile })
        this.state.refresh()
    }

    handleUploadImage = (e) => {
        console.log(this.uploadInput.files)
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

    handleChange(event) {
        if (event.target.files.length > 1) {
            for (var i = 0; i < event.target.files.length; i++) {
                console.log(event.target.files[i])
                const url = URL.createObjectURL(event.target.files[i])
                console.log("url ", url)
                this.setState(prevState => ({
                    ...prevState,
                    files:
                        [...prevState.files, url]
                }))
            }
        }
        else {
            this.setState({
                file: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    render() {

        const tabs = [
            {
                menuItem: 'Single File Upload',
                render: () => {
                    return <Tab.Pane>
                        <Form onSubmit={this.handleUploadImage}>
                            <Header>Select File</Header>
                            <input type="file" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
                            <Header>Preview:</Header>
                            <Image size="large" src={this.state.file} />
                            <Divider />
                            <Container>
                                <Tags id={'-2'}/>
                            </Container>
                            <Container>
                                <People id={'-2'} />
                            </Container>
                            <Divider />
                            <Button as='a' onClick={this.toggleUpload}>Cancel</Button>
                            <Button type='submit' color='orange' >Submit</Button>
                        </Form>
                    </Tab.Pane>
                }
            },
            {
                menuItem: 'Bulk Folder Upload',
                render: () => {
                    return <Tab.Pane>
                        <Form onSubmit={this.handleUploadFolder}>
                            <Header>Select FOLDER</Header>
                            <input type="file" directory="" webkitdirectory="" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
                            <Header>Preview:</Header>
                            <div className='previewImgs'>
                                {this.state.files.length > 0 && this.state.files.map(file => <Image size="small" src={file} />)}
                            </div>
                            <Divider />
                            <Container>
                                <Tags id={'-2'} bulk={true}/>
                            </Container>
                            <Container>
                                <People id={'-2'} bulk={true} />
                            </Container>
                            <Divider />
                            <Button as='a' onClick={this.toggleUpload}>Cancel</Button>
                            <Button type='submit' color='orange' >Submit</Button>
                        </Form>
                    </Tab.Pane>
                }
            }
        ]
        return (
            <div>
                <Modal
                    open={this.state.uploadFile}
                    trigger={<Button className="rightButton" onClick={this.toggleUpload} color='orange' size='large' >Upload</Button>}>
                    <Modal.Content>
                        <Tab menu={{ color: 'orange', attached: true, inverted: true }} panes={tabs} />
                    </Modal.Content>
                </Modal>
            </div>
        )
    }

}
export default UploadFileModal;