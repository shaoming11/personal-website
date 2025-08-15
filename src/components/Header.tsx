import { NavLink, Link } from "react-router";

function Header() {
    const navItemClasses = "inline mx-2.5";
    const navLinkClasses = "no-underline hover:font-bold";

    return(
        <header>
            <nav>
                <ul className="list-none flex justify-center items-center my-5">
                    <li className={navItemClasses}>
                        <Link to="/" className={navLinkClasses}>Home</Link>
                    </li>
                    <li className={navItemClasses}>
                        <Link to="/about" className={navLinkClasses}>About</Link>
                    </li>
                    <li className={navItemClasses}>
                        <Link to="/experiences" className={navLinkClasses}>Experiences</Link>
                    </li>
                    <li className={navItemClasses}>
                        <Link to="/projects" className={navLinkClasses}>Projects</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header
