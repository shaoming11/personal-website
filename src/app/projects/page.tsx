"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Globe, Users } from "lucide-react";
import { MdOutlineDarkMode } from "react-icons/md";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

const projects = [
  {
    id: 0,
    title: "helpidontknowhowtonetworkin.tech",
    description: "A comprehensive networking platform designed to help developers and tech professionals build meaningful connections.",
    image: "/help.png",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "TensorFlow"],
    url: "https://github.com/naman-sonawane/helpidontknowhowtonetworkintech",
    year: 2025,
  },
  {
    id: 1,
    title: "SupplyMe",
    description: "An innovative supply chain management platform that streamlines inventory tracking, supplier management, and order processing for small to medium businesses.",
    image: "/supply.png",
    tech: ["Django", "Node.js", "Flutter", "MongoDB"],
    url: "https://github.com/shaoming11/supplyme-server",
    year: 2025,
  },
  {
    id: 2,
    title: "shao-lib",
    description: "Custom position tracking and motion algorithm library for VEX V5",
    image: "/shaolib.jpg",
    tech: ["C++", "PROS"],
    url: "https://github.com/shaoming11/shao-lib",
    year: 2025,
  }
];

const Projects = () => {
    const bubbleClass = "outline-solid rounded-4xl bg-white/7 shadow-black backdrop-blur-xs";
    const iconClass = "m-auto"
    const router = useRouter();

    return (
    <div className="min-w-screen">
        <div className="min-h-screen relative m-auto w-5xl">
            <Nav />
            <ul className="pt-10 w-1/2 m-auto">
                {projects.map(({id, title, description, image, tech, url, year}) => 
                <li key={id} className="mb-12">
                    <Link href={url} target="_blank">
                        <img src={image} className={`${bubbleClass} hover:cursor-pointer mb-4 h-48 w-full object-cover`}></img>
                    </Link>
                    <div className="flex justify-between mb-2">
                        <p className="font-bold text-base/relaxed">{title}</p> {/**TITLE */}
                        <p>{year}</p> {/**YEAR */}
                    </div>

                    <ul className="flex justify-start flex-wrap"> {/**TAGS */}
                    {tech.map((i) => <li key={tech.indexOf(i)} className="text-nowrap text-xs py-1 pl-4 pr-4 rounded-3xl dark:bg-gray-800 light:bg-gray-100 mx-1 my-1">{i}</li>)}
                    </ul>

                    <p className="text-base/relaxed mt-2">{description}</p> {/**DESCRIPTION */}
                </li>
                )}
            </ul>
        </div>
    </div>
    );
};

export default Projects;