function ExCard({title="Title", date="2000", org="Undefined"}) {
    return (
        <div className="ex-card">
            <h2>{title} @ {org}</h2>
            <h3>{date}</h3>
        </div>
    )
}

export default ExCard;
