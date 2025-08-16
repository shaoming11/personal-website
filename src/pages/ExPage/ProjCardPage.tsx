import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
function ProjCardPage({imgSrc, date, name, tags, description, isOpen, projUrl} : {imgSrc: string; date: string; name: string; tags: string[]; description: string; isOpen: boolean, projUrl: string}) {
    const renderTags = (list: string[]) => (
    <ul className="flex gap-2">
        {list.map((tag, index) => (
        <li key={index} className="bg-gray-400 px-2 py-1 rounded text-white text-sm">
            {tag}
        </li>
        ))}
    </ul>
);

    return (
        <div className="bg-gray-100 w-full p-5 my-2 rounded-lg flex hover:cursor-pointer">
            <div className={isOpen ? "hidden" : "block w-full"}>
                <div className="relative">
                    <img src={imgSrc} alt="jamal" className="w-2000 h-32 object-cover opacity-20 rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center p-5">
                        <h1 className="flex-grow pr-5">{name}</h1>
                        <h2>{date}</h2>
                    </div>
                </div>
            </div>
            <div className={isOpen ? "block w-full" : "hidden"}>
                <div className="flex justify-between">
                    <div className="">
                        <h1 className="text-3xl mb-2">{name}</h1>
                        <h2 className="text-l">{renderTags(tags)}</h2>
                    </div>
                    <h2 className="text-l">{date}</h2>
                </div>
                <div className="bg-gray-300 p-5 rounded-lg mt-5">
                    <div className="relative">
                        <img src={imgSrc} alt="jamal" className="w-2000 h-64 object-cover" />
                    </div>
                    <p className="my-5">{description}</p>
                    <a target="_blank" href={projUrl} className="bg-gray-400 p-2 hover:bg-gray-500">Website <GoArrowUpRight className="inline"/></a>
                </div>
            </div>
        </div>
    )
}

export default ProjCardPage;