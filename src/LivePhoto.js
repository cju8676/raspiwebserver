import { React, useState, useRef } from 'react'
import handleViewport from 'react-in-viewport';
import ReactPlayer from 'react-player';
import { Transition, Container } from 'semantic-ui-react';


function LivePhoto({ vid, img }) {
    const [playing, setPlaying] = useState(false)
    const playerRef = useRef(null)
    const [pulse, setPulse] = useState(true)

    const goToZero = () => {
        if (playerRef.current !== null && playerRef.current.getCurrentTime() !== 0) {
            // var time = playerRef.current.getCurrentTime()
            setPulse(!pulse)
            playerRef.current.seekTo(0)
            setPlaying(false)
        }
    }

    return (
            <div 
                onMouseEnter={() => setPlaying(true)} 
                onMouseLeave={goToZero} 
                className='live-photo-child'>
                <Transition
                    animation='pulse'
                    duration={250}
                    visible={pulse}
                >
                    <Container className='live-photo-container'>
                        <ReactPlayer
                            onMouseEnter={() => console.log("entering...")}
                            ref={playerRef}
                            url={vid}
                            playing={playing}
                            muted
                            width='100%' 
                            height='100%'
                            onEnded={goToZero}
                        />
                    </Container>
                </Transition>
            </div>
    )
}

const MyLivePhoto = handleViewport(LivePhoto, /*options: {}, config{} */);

export default MyLivePhoto