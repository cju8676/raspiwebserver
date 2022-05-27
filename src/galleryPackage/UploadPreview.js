import React from 'react'
import { Header, Image, Segment, Dimmer, Loader } from 'semantic-ui-react'
import MyLivePhoto from '../LivePhoto'

// Component to handle the preview section of the UploadFileModal
export default function UploadPreview({ uploadFiles, folders, isBulk, loading }) {
    // todo save folder to album

    return isBulk ? (
        <Dimmer.Dimmable>
            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>
            <Header>Preview:</Header>
            {folders && folders.length > 0 &&
                <div>
                    {folders.map(folder => {
                        return (
                            <>
                                <Segment color='orange'>
                                    <Header as='h4'>{folder.name}</Header>
                                    {/* <div className='previewImgs'>
                                        {folder.files.map(file => <Image size="small" src={uploadFiles.find(i => i.name === file["name"]).url} />)}
                                    </div> */}
                                    {/* If source is an obj we know it is a live photo */}
                                    <div className='upload-parent'>
                                        {folder.files.map(file => {
                                            return typeof(file) === "object" ? <MyLivePhoto {...file} /> : <Image size="small" src={file} />
                                        })}
                                    </div>
                                </Segment>
                            </>)
                    })}
                </div>
            }
            {/* {livePhotos.length ? livePhotos.map(obj => <MyLivePhoto {...obj} />) : <></>} */}
        </Dimmer.Dimmable>
    ) : (
        <>
            <Header>Preview:</Header>
            {uploadFiles.length ? <Image size="large" src={uploadFiles[0].url} /> : <></>}
        </>
    )
}