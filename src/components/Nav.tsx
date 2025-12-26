"use client";

import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";

const Nav = () => {
    const bubbleClass = "outline-solid rounded-4xl bg-white/7 shadow-black backdrop-blur-xs";
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark");

    useEffect(() => {
        if (theme == "dark") {
            document.documentElement.className = theme;
            localStorage.setItem("theme", "dark")
        } else if (theme == "light") {
            document.documentElement.className = theme;
            localStorage.setItem("theme", "light")
        }
    }, [theme]);

    return (
        <div className="grid grid-cols-[100px_1fr_100px] pt-12"> {/* Nav Section */}
            <div className="my-auto">shaomingwu.com</div> {/* SHAOMINGWU.com */}
                <div className="m-auto">
                <div className={`m-auto p-4 ${bubbleClass}`}> {/* ABOUT PROJECTS */}
                    <Link className="m-4" href={'/'}>about</Link>
                    <Link className="m-4" href={'/projects'}>projects</Link>
                </div>
            </div>
            <div className="block">
                <MdOutlineDarkMode onClick={() => {setTheme("light")}} size={"2.5em"} className={`${bubbleClass} w-14 h-14 p-3 scale-100 block light:scale-0 absolute hover:cursor-pointer`}/> {/* LIGHT/DARK MODE */}
                <MdOutlineLightMode onClick={() => {setTheme("dark")}} size={"2.5em"} className={`${bubbleClass} w-14 h-14 p-3 scale-0 light:scale-100 hidden light:block hover:cursor-pointer absolute`}/> {/*LIGHT/DARK MODE*/}
            </div>
        </div>
    )
};

export default Nav;