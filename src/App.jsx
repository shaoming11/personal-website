import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Intro from './components/Intro.jsx'
import Experiences from './components/Experiences.jsx'
import Projects from './components/Projects.jsx'

function App() {
    return(
        <div className='page'>
            <Header/>
            <Intro/>
            <Experiences/>
            <Projects/>
            <Footer/>
        </div>
    );
}

export default App
