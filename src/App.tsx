import Header from './components/Header'
import Footer from './components/Footer'
import Intro from './components/Intro'
import Experiences from './components/Experiences'
import Projects from './components/Projects'
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './pages/mode-toggle'

function App() {
    return(
        <div>
            <ModeToggle></ModeToggle>
            <div className='md:w-2/5 w-4/5 m-auto'>
                <Header/>
                <Intro/>
                <Experiences/>
                <Projects/>
                <Button>Hi</Button>
                <Footer/>
            </div>
        </div>
    );
}

export default App