import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import handleViewport from 'react-in-viewport'
import { Button, Image } from 'semantic-ui-react'

// Our media that presents itself in the top left of our ImagePane
const PaneMedia = ({ isVideo, media, name}) => {

    /* Controls if the media is a video */
    const [displayVidControls, setControlsVisible] = useState(false);
    const [muted, setMuted] = useState(false);
    const [playing, setPlaying] = useState(true);

    return isVideo ? (
        <div
            onMouseEnter={() => setControlsVisible(true)}
            onMouseLeave={() => setControlsVisible(false)}
        >
            <div
                className='player-wrapper'
                onClick={() => setPlaying(!playing)}
            >
                <ReactPlayer
                    className='react-player'
                    url={media}
                    playing={playing}
                    loop
                    width='100%'
                    height='100%'
                    volume={null}
                    muted={muted}
                />
            </div>
            {displayVidControls &&
                <>
                    <Button onClick={() => setMuted(!muted)}>Mute</Button>
                    <Button onClick={() => setPlaying(!playing)}>Play/Pause</Button>
                </>
            }
        </div>
    ) : (
        <Image fluid src={media} alt={name} />)
}

const MyPaneMedia = handleViewport(PaneMedia, /*options: {}, config{} */);

export default MyPaneMedia