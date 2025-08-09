function PCard({title="Title", skills="Skills, skills", description="Lorem ipsum sit dolor amet"}) {
    return (
        <div className="ex-card">
            <h2>{title}</h2>
            <h3>{skills}</h3>
            <p>{description}</p>
        </div>
    )
}

export default PCard;