import React, {useEffect, useState} from 'react'

export default function Test() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        console.log(`clicked ${count} times`)
    })

    return <button onClick={() => setCount(count + 1)}>Hello World</button>
}