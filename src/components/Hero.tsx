"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";
import { MdOutlineMail, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import Nav from "@/components/Nav"

/**
 * The Hero component is the main component of the landing page.
 * It contains animated background patterns, a title, a subtitle, and a call-to-action button.
 * The title and subtitle are animated to fade in and scale up, while the call-to-action button is animated to bounce up and down.
 * The background patterns are animated to move in a random direction with a random duration and delay.
 * The Hero component is responsive and works well on both desktop and mobile devices.
 */
const Hero = () => {
  const bubbleClass = "outline-solid rounded-4xl bg-white/7 shadow-black backdrop-blur-xs";
  const iconClass = "m-auto"

  return (
    <div className="min-w-screen">
      <div className="min-h-screen relative m-auto w-5xl">
        <Nav />
        <div className="w-2xl m-auto my-10"> {/* Main Section */}
          <div className="grid grid-cols-3">
            <img src={"shaoming.png"} className="col-span-1 m-4 p-6"/>
            <div className="pt-20 col-span-2 m-4 pr-5 "><b>Hey, I'm Shaoming!</b><br/><p className="dark:text-gray-300 light:text-gray-600">I'm a student at Milliken Mills High School, with a passion in the <a href="https://www.youtube.com/watch?v=g-mZWWTirZE&t=53s" className="hover:cursor-default" target="_blank">crossover and intersection</a> between volleyball 🏐, robotics 🤖, and cello 🎻.</p></div>
          </div>
          <div className="pb-4 px-4 w-xl m-auto text-base/relaxed"> {/* EXPERIENCES LIST: */}
            <p>currently doing:</p>
            <ul className="list-disc pl-4 hover:pl-6">
              <li className="hover:underline hover:cursor-pointer"><b><a href="https://www.vexrobotics.com/" target="_blank">Engineering @ VEX Robotics</a></b></li>
              <li className="hover:underline hover:cursor-pointer"><b><a href="https://www.hackcanada.org/" target="_blank">Outreach @ Hack Canada</a></b></li>
            </ul>
          </div>
          <div className="p-4 w-xl m-auto text-base/relaxed"> {/* PROJECTS LIST */}
            <p>what i've built:</p>
            <ul className="list-disc pl-4 hover:pl-6">
              <li><a className='hover:underline' href="https://github.com/naman-sonawane/helpidontknowhowtonetworkintech" target="_blank">help...network.tech</a> | networking tool for CS students <br/></li>
              <li><a className='hover:underline' href="https://github.com/shaoming11/supplyme-client" target="_blank">SupplyMe</a> | helping businesses locate suppliers <br/></li>
              <li><a className='hover:underline' href="https://github.com/shaoming11/shao-lib" target="_blank">shao-lib</a> | custom motion algorithm library for robotics <br/></li>
            </ul>
          </div>

          <div className="grid grid-cols-5 p-4 w-lg mx-auto my-10">{ /* Additional Info */}
            <div className={`grid grid-cols-4 col-span-3 p-4 ${bubbleClass}`}> {/* CONTACTS */}
              <a className={iconClass} href="https://www.linkedin.com/in/shaoming-wu/" target="_blank"><FaLinkedinIn size={"1.2em"}/></a> 
              <a className={iconClass} href="https://x.com/shaomng" target="_blank"><FaXTwitter size={"1.2em"}/></a> 
              <a className={iconClass} href="https://github.com/shaoming11" target="_blank"><FiGithub size={"1.2em"}/></a> 
              <a className={iconClass} href="mailto:smwu007@gmail.com" target="_blank"><MdOutlineMail size={"1.2em"}/></a>
            </div>
            <div className={`${bubbleClass} m-auto py-4 px-10 col-span-2`}><a href="resume.pdf" className="light:hover:text-gray-700 dark:hover:text-gray-300" target="_blank">resume</a></div> {/* RESUME */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;