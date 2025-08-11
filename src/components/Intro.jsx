import { ImGithub } from "react-icons/im";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

function Intro() {
    const iconClass = "m-1 cursor-pointer black hover:text-blue-500"

    return (
        <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl">Hi, I'm Shaoming</h1>
            <ul className="list-none flex justify-left items-center mx-5">
                <li><a href="https://github.com/shaoming11" target="blank"><ImGithub size={20} className={iconClass}/></a></li>
                <li><a href="https://linkedin.com/in/shaoming-wu" target="blank"><FaLinkedin size={20} className={iconClass}/></a></li>
                <li><a href="https://twitter.com/shaomng" target="blank"><FaXTwitter size={20} className={iconClass}/></a></li>
                <li><a href="mailto:shaoming.wu@outlook.com" target="blank"><MdEmail size={20} className={iconClass}/></a></li>
            </ul>
        </div>
    )
}

export default Intro;