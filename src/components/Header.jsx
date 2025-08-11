
function Header() {
    const navItemClasses = "inline mx-2.5";
    const navLinkClasses = "no-underline text-black hover:font-bold";

    return(
        <header>
            <nav>
                <ul className="list-none flex justify-center items-center my-5">
                    <li className={navItemClasses}>
                        <a href="#" className={navLinkClasses}>Home</a>
                    </li>
                    <li className={navItemClasses}>
                        <a href="#about" className={navLinkClasses}>About</a>
                    </li>
                    <li className={navItemClasses}>
                        <a href="#experiences" className={navLinkClasses}>Experiences</a>
                    </li>
                    <li className={navItemClasses}>
                        <a href="#projects" className={navLinkClasses}>Projects</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header