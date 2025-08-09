import ExCard from './ExCard.jsx'

function Experiences() {
    return (
        <div className='experiences container'>
            <h1>Experiences</h1>
            <ExCard title="(VEX 1165A) Co-Founded 12-person team + Won multiple tournaments" org='Altura Robotics' date="May 2024 - Present"/>
            <ExCard title="Event emcee + hosted workshops" org="Caution Tape Independent Program" date="June 2024 - May 2025"/>
            <ExCard title="(VEX 1140Z/1140R) Built robots + volunteered for 3+ competitions" org="Brampton Robotics" date="September 2021 - April 2024"/>
        </div>
    )
}

export default Experiences;