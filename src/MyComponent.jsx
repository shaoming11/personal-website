import React, {useState, useEffect} from 'react';

function MyComponent() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        document.addEventListener("resize". handleResize);
        console.log("ADDED LISTENER");

        return () => {
            document.removeEventListener("resize");
            console.log("REMOVED LISTENER");
        }
    }, [])

    const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    return (
        <div>
            <h1>Width: {width} px</h1>
            <h1>Height: {height} px</h1>
        </div>
    )
}

export default MyComponent