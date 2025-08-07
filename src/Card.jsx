import profilePic from './assets/pfp.png'

function Card() {
    return(
        <div className="card">
            <img src={profilePic} alt="pfp" className="card-image"></img>
            <h2 className="card-title">Shaoming</h2>
            <p className='card-text'>milliken mills high school</p>
        </div>
    )
}

export default Card