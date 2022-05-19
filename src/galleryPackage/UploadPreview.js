import React from 'react'
import { Header, Image, Segment } from 'semantic-ui-react'

// Component to handle the preview section of the UploadFileModal
export default function UploadPreview({ uploadFiles, folders, isBulk }) {

    // todo save folder to album

    return isBulk ? (
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
            <Image size="large" src={uploadFiles} />
        </>
    )
}