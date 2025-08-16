import Header from "@/components/Header"
import ProjCardPage from "./ProjCardPage";
import NetworkImg from "@/assets/redemption.jpeg"
import SupplyImg from "@/assets/discobots.jpg"
import ShaolibImg from "@/assets/robotics.jpg"
import { useState } from "react";

function ProjPage() {
    const [network, setNetwork] = useState(false);
    const [supply, setSupply] = useState(false);
    const [shaolib, setShaolib] = useState(false);

    // {imgSrc, date, name, tags, description, isOpen, projUrl} 
    const networkCard = {
        name: "networking",
        tags: ["MERN", "TensorFlow"], 
        date: "May 2025",
        projUrl: "https://github.com/naman-sonawane/helpidontknowhowtonetworkintech",
        imgSrc: NetworkImg,
        description: "🏆 Best Gen AI Hack at JAMHacks 9. Full-stack networking platform featuring face recognition, user authentication, and real-time data processing to help tech professionals build meaningful connections.",
        isOpen: network
    };

    const supplyCard = {
        name: "SupplyMe",
        tags: ["Django", "REST"], 
        date: "June 2025",
        projUrl: "https://github.com/shaoming11/supplyme-server",
        imgSrc: SupplyImg,
        description: "Django-powered supply chain management system with RESTful API architecture. Streamlines inventory tracking, vendor management, and procurement processes for efficient business operations.",
        isOpen: supply        
    };

    const shaolibCard = {
        name: "shao-lib",
        tags: ["C++", "PROS"], 
        date: "Aug 2025",
        projUrl: "https://github.com/shaoming11/shao-lib",
        imgSrc: ShaolibImg,
        description: "Custom C++ library for robotics applications featuring advanced position tracking algorithms and motion control systems. Optimized for VEX robotics competitions and autonomous navigation.",
        isOpen: shaolib
    };

    return (
        <>
            <Header/>
            <h1 className="text-5xl mb-5">Projects</h1>
            <button onClick={() => {setNetwork(true);setSupply(false);setShaolib(false);}}><ProjCardPage {...networkCard}/></button>
            <button onClick={() =>  {setNetwork(false);setSupply(true);setShaolib(false);}}><ProjCardPage {...supplyCard}/></button>
            <button onClick={() =>  {setNetwork(false);setSupply(false);setShaolib(true);}}><ProjCardPage {...shaolibCard}/></button>
        </>
    )
}

export default ProjPage;