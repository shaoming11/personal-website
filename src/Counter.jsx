import React, {useState} from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count+1);
    }

    const decrement = () => {
        setCount(count-1);
    }

    const reset = () => {
        setCount(0);
    }

    return (
        <div className="counter-container">
            <p className='count-display'>{count}</p>
            <button onClick={increment} className='counter-button'>More</button>
            <button onClick={reset} className='counter-button'>Reset</button>
            <button onClick={decrement} className='counter-button'>Less</button>
        </div>
    )
}

export default Counter;