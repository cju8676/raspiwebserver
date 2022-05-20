import { useState, useEffect } from 'react'

// Counts down from duration once rendered 
export default function Timer({duration, handleAtZero}) {
    // current time
    const [counter, setCounter] = useState(duration)
    // true when Timer is mounted
    
    useEffect(() => {
        let isSubscribed = true;
        counter === 0 && handleAtZero()
        if (isSubscribed)
            counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
        return () => {
            isSubscribed = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter])

    // renders the current second
    return (
        counter
    )
}