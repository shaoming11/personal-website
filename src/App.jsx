import Button from './Button.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Card from './Card.jsx'
import Student from './Student.jsx'
import UserGreeting from './UserGreeting.jsx'
import List from './List.jsx'
import MyComponent from './MyComponent.jsx'
import Counter from './Counter.jsx'

function App() {
    const fruits = [
                {id: 1, name: "Apple", calories: 130},
                {id: 2, name: "Orange", calories: 50},
                {id: 3, name: "Banana", calories: 20},
                {id: 4, name: "Watermelon", calories: 200},
                {id: 5, name: "Pineapple", calories: 250}
            ]

    return(
        <>
            {/* {fruits.length > 0 ? <List category="Fruits" items={fruits}/> : null} */}
            <MyComponent/>
        </>
    );
}

export default App
