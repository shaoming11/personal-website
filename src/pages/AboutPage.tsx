import Header from "@/components/Header"
import Prof from "@/assets/pfp.jpeg"

function AboutPage() {
    return (
        <>
        <Header/>
        <div className="flex flex-col items-center gap-8">
        <div className="flex-shrink-0">
            <img src={Prof} alt="Shaoming Wu" className="w-64 h-64 rounded-lg object-cover shadow-md"/>
        </div>

        <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">About Me</h1>
            
            <div className="prose prose-lg text-gray-600 leading-relaxed">
                <p className="mb-6">
                    Hi! I'm <span className="font-semibold text-gray-800">Shaoming Wu</span>, a passionate high school student at Milliken Mills High School with a deep love for robotics, programming, and technology. My journey in tech began through VEX robotics competitions, where I've had the incredible opportunity to co-found teams, build competitive robots, and even host tournaments that bring together dozens of teams from across the region.
                </p>
                
                <p className="mb-6">
                    Over the past few years, I've been involved with organizations like <span className="font-semibold">Altura Robotics</span>, where I co-founded a 12-person team and organized a 24-team tournament, and <span className="font-semibold">Brampton Robotics</span>, where I spent nearly three years building robots and volunteering for competitions. I also work as an event emcee and workshop host with the Caution Tape Independent Program, helping to educate and inspire the next generation of robotics enthusiasts.
                </p>
                
                <p className="">
                    When I'm not coding or building robots, you'll find me on the volleyball court. I absolutely love playing volleyball – there's something about the fast-paced teamwork and strategic thinking that really appeals to me, much like the collaborative problem-solving I enjoy in robotics and programming.
                </p>
            </div>
        </div>
        </div>
        </>
    )
}

export default AboutPage;