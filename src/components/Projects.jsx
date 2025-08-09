import PCard from './PCard.jsx'

function Projects() {
    return (
        <div className='experiences container'>
            <h1>Projects</h1>
            <PCard title="helpidontknowhowtonetworkin.tech" skills="MERN, TensorFlow" description="Face recognition app for CS students to get better at networking"/>
            <PCard title="shao-lib" skills="C++, PROS" description="Custom library to investigate motion algorithms & position tracking"/>
            <PCard title="SupplyMe" skills="Django, REST, Flutter" description="Semantic searching supplier info for small businesses"/>
        </div>
    )
}

export default Projects;