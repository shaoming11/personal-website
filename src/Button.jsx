function Button() {
    const handleClick = (e) => e.target.textContent = "OUCH 🤕";

    return (<button onClick={handleClick}>Click me!</button>)
}

export default Button;