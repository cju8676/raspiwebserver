import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import handleViewport from 'react-in-viewport'
import { Button, Image } from 'semantic-ui-react'
import MyLivePhoto from '../LivePhoto'

// Our media that presents itself in the top left of our ImagePane
const PaneMedia = ({ type, media, name, mp4 = null }) => {

    /* Controls if the media is a video */
    const [displayVidControls, setControlsVisible] = useState(false);
    const [muted, setMuted] = useState(false);
    const [playing, setPlaying] = useState(true);

    function getMedia() {
        switch (type) {
            case "live":
                return (
                    <div>
                        <MyLivePhoto vid={mp4} img={media} />
                    </div>
                )
            case "video":
                return (
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
                            <Button.Group basic size='small'>
                                {muted ? (
                                    <Button icon='mute' onClick={() => setMuted(false)} />
                                ) : (
                                    <Button icon='unmute' onClick={() => setMuted(true)} />
                                )}
                                {playing ? (
                                    <Button icon='pause' onClick={() => setPlaying(false)} />
                                ) : (
                                    <Button icon='play' onClick={() => setPlaying(true)} />
                                )}
                            </Button.Group>
                        }
                    </div>
                )
            case "altvideo":
                return (
                    <video muted controls autoPlay loop className='pane-media'>
                        <source src={media} type="video/mp4"></source>
                    </video>
                )
            case "photo":
            default:
                return (
                    <Image fluid src={media} alt={name} />
                )
        }
    }

    return getMedia()
}

const MyPaneMedia = handleViewport(PaneMedia, /*options: {}, config{} */);

export default MyPaneMedia