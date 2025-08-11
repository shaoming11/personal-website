import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Intro from './components/Intro.jsx'
import Experiences from './components/Experiences.jsx'
import Projects from './components/Projects.jsx'

function App() {
    return(
        <div className='md:w-2/5 w-4/5 m-auto'>
            <Header/>
            <Intro/>
            <Experiences/>
            <Projects/>
            <Footer/>
        </div>
    );
}

export default App
