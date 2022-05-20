import React, { useState, useEffect } from 'react'

// Counts down from duration once rendered 
export default function Timer({duration, handleAtZero}) {
    // current time
    const [counter, setCounter] = useState(duration)
    // true when Timer is mounted
    let isSubscribed = true;

    useEffect(() => {
        if (isSubscribed)
            counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        return () => {
            isSubscribed = false;
        }
    }, [counter])

    useEffect(() => {
        counter === 0 && handleAtZero()
    })

    // renders the current second
    return (
        counter
    )
}