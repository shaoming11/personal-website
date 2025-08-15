import Header from "@/components/Header"
import { useState } from "react";

function ExPage() {
    const [card, setCard] = useState(false);

    return (
        <>
            <Header/>
            <h1 className="">Experiences</h1>
            <div>
                <h2>Co-Founder @ Altura Robotics</h2>
                <h2>May 2024-Present</h2>
                <img src=""></img>
                <p className={card ? "inline" : "hidden"}>Hosted tournament of 24 teams. Developed 100+ autonomous routes. Hosted 100+ workshops</p>
            </div>
        </>
    )
}

export default ExPage;