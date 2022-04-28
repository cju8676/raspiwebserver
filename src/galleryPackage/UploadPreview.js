import React from 'react'
import { Header, Image, Segment } from 'semantic-ui-react'

// Component to handle the preview section of the UploadFileModal
export default function UploadPreview(props) {
    const { uploadFiles, folders } = props;

    // todo save folder to album
    console.log(uploadFiles)
    console.log(folders)

    return props.isBulk ? (
        <>
            <Header>Preview:</Header>
            {folders.length > 0 &&
                <div>
                    {folders.map(folder => {
                        return (
                            <>
                                <Segment color='orange'>
                                    <Header as='h4'>{folder.name}</Header>
                                    <div className='previewImgs'>
                                        {folder.files.map(file => <Image size="small" src={uploadFiles.find(i => i.name === file["name"]).url} />)}
                                    </div>
                                </Segment>
                            </>)
                    })}
                </div>
            }
        </>
    ) : (
        <>
            <Header>Preview:</Header>
            <Image size="large" src={props.uploadFiles} />
        </>
    )
}