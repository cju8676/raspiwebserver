import { React, useState } from 'react'
import handleViewport from 'react-in-viewport';
import ReactPlayer from 'react-player';
import { Image } from 'semantic-ui-react';


const LivePhoto = (props) => {

    const { vid, img } = props;
    const [live, setLive] = useState(false)

    return (
        <div onMouseEnter={() => setLive(true)} onMouseLeave={() => setLive(false)}>
            {!live &&
                <Image size="small" src={img} />
            }
            {live &&
                <div className='player-wrapper'>
                    <ReactPlayer
                        url={vid}
                        playing={true}
                        loop
                        muted
                        width='100%' /*height='100%'*/ />
                </div>
            }
        </div>
    )
}

const MyLivePhoto = handleViewport(LivePhoto, /*options: {}, config{} */);

export default MyLivePhoto