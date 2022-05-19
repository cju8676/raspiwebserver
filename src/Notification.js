import React, { useState, useEffect, useContext } from 'react'
import { Message, Transition } from 'semantic-ui-react';
import { UserContext } from './UserContext';

export default function Notification(props) {
    const [visible, setVisible] = useState(false)
    const { successNotification, showSuccessNotification, errorNotification, showErrorNotification } = useContext(UserContext)

    useEffect(() => {
        if (successNotification || errorNotification)
            setVisible(true)
    }, [successNotification, errorNotification])

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (successNotification)
                    showSuccessNotification(null)
                if (errorNotification)
                    showErrorNotification(null)
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [visible])

    return (
        <Transition visible={visible} animation="slide down" duration={500}>
        {/* {successNotification &&
            <Message positive content={successNotification} />
        }
        {errorNotification &&
            <Message negative content={errorNotification} />
        } */}
            <Message positive={successNotification} negative={errorNotification} content={successNotification ?? errorNotification} />
        </Transition>
    )
}