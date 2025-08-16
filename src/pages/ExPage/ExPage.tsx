import Header from "@/components/Header"
import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import roboticsImage from "@/assets/robotics.jpg"

function ExPage() {
    const [card, setCard] = useState(true);

    return (
        <>
            <Header/>
            <h1 className="text-5xl mb-5">Experiences</h1>
            <div className="bg-gray-100 w-full p-5 rounded-lg flex">
                <div className={card ? "hidden" : "block"}>
                    <h1 className="flex-grow">Co-Founder @ Altura Robotics</h1>
                    <h2>May 2024 - Present</h2>
                    <img src=""></img>
                </div>
                <div className={card ? "block" : "hidden"}>
                    <div className="flex">
                        <div className="flex-grow">
                            <h1 className="text-3xl">Co-Founder</h1>
                            <h2 className="text-l">Altura Robotics</h2>
                        </div>
                        <h2 className="text-l">May 2024 - Present</h2>
                    </div>
                    <div className="bg-gray-300 p-5 rounded-lg mt-5">
                        <div className="relative">
                            <img src={roboticsImage} alt="jamal" className="w-full h-64 object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                            </div>
                        </div>
                        <p className="my-5">Hosted tournament of 24 teams. Developed 100+ autonomous routes. Hosted 100+ workshops</p>
                        <a target="_blank" href="https://www.instagram.com" className="bg-gray-400 p-2 hover:bg-gray-500">Website <GoArrowUpRight className="inline"/></a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExPage;