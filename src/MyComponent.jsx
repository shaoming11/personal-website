import React, {useState} from 'react';

function MyComponent() {
    const [name, setName] = useState("Guest");

    const handleName = (e) => {
        setName(e.target.value);
    }

    return (
        <div>
            <input value={name} onChange={(e) => handleName(e)}></input>
            <p>{name}</p>
        </div>
    )
}

export default MyComponent