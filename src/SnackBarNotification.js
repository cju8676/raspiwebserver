import React, { useState, useEffect } from 'react'
import { Message, Transition } from 'semantic-ui-react';
import ReactDOM from 'react-dom';

export default function SnackBarNotification(props) {
    
    const [closeTimeout, setCloseTimeout] = useState(null)

    useEffect(() => {
        beginCloseTimeout();
    }, [])

    const closeSnackBar = () => {
        clearTimeout(closeTimeout);
        ReactDOM.unmountComponentAtNode(document.getElementById('snackbar-fixed-container'))
    }

    const beginCloseTimeout = () => {
        if (props.timer) {
            const timeout = setTimeout(() => closeSnackBar(), props.timer)
            setCloseTimeout(timeout);
        }
    }

    return (
        <div
            onMouseEnter={() => clearTimeout(closeTimeout)}
            onMouseLeave={() => beginCloseTimeout()}>
        <Transition visible={closeTimeout} animation="slide up" duration={500}>
            <Message positive={props.messageType === 'success'} negative={props.messageType === 'error'} content={props.message} />
        </Transition>
        </div>
    )
}