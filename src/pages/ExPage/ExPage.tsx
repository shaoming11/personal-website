import Header from "@/components/Header"
import CardExPage from "./CardExPage";
import AlturaImg from "@/assets/redemption.jpeg"
import BramptonImg from "@/assets/discobots.jpg"
import CautionImg from "@/assets/robotics.jpg"
import { useState } from "react";

function ExPage() {
    const [altura, setAltura] = useState(false);
    const [brampton, setBrampton] = useState(false);
    const [caution, setCaution] = useState(false);

    const alturaCard = {
        org: "Altura Robotics",
        role: "Co-Founder", 
        date: "May 2024 - Present",
        orgUrl: "https://www.instagram.com/alturafoundation/",
        imgSrc: AlturaImg,
        description: "Developed 100+ autonomous routes. ",
        isOpen: altura
    };

    const cautionCard = {
        org: "Caution Tape Independent Program",
        role: "Outreach Lead", 
        date: "May 2024 - Present",
        orgUrl: "https://www.instagram.com/_cautiontape/",
        imgSrc: CautionImg,
        description: "Tournament of 24 teams. Hosted 100+ workshops",
        isOpen: caution        
    };

    const bramptonCard = {
        org: "Brampton Robotics",
        role: "Mechanical Designer", 
        date: "Sep 2022 - April 2024",
        orgUrl: "https://www.instagram.com/bramptonrobotics/",
        imgSrc: BramptonImg,
        description: "Participated in 5 world championships, volunteered for 3+ competitions.",
        isOpen: brampton
    };

    return (
        <>
            <Header/>
            <h1 className="text-5xl mb-5">Experiences</h1>
            <button onClick={() => {setAltura(true);setBrampton(false);setCaution(false);}}><CardExPage {...alturaCard}/></button>
            <button onClick={() =>  {setAltura(false);setBrampton(true);setCaution(false);}}><CardExPage {...bramptonCard}/></button>
            <button onClick={() =>  {setAltura(false);setBrampton(false);setCaution(true);}}><CardExPage {...cautionCard}/></button>
        </>
    )
}

export default ExPage;