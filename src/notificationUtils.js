import ReactDOM from 'react-dom';
import React from "react";
import SnackBarNotification from './SnackBarNotification';

const triggerSnackbar = (title, message, messageType) => {
    const validMessageTypes = ['error', 'info', 'warning', 'success'];
    if (!validMessageTypes.includes(messageType)) {
        throw Error("Invalid snackbar message type");
    }
    ReactDOM.render(
        <SnackBarNotification messageType={messageType} timer={4000} title={title} message={message} />,
        document.getElementById('snackbar-fixed-container')
    );
}

export const showErrorNotification = (message, title="") => {
    triggerSnackbar(title, message, 'error');
}

export const showInfoNotification = (message, title="") => {
    triggerSnackbar(title, message, 'info');
}

export const showSuccessNotification = (message, title="") => {
    triggerSnackbar(title, message, 'success');
}

export const showWarningNotification = (message, title="") => {
    triggerSnackbar(title, message, 'warning');
}