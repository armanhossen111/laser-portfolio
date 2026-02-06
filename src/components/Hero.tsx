import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <>
            {/* Skip to main content link for accessibility */}
            <a href="#work" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-safety-orange focus:text-white focus:font-bold">Skip to portfolio</a>

            <section className="relative min-h-screen bg-dark-slate flex flex-col md:flex-row items-center overflow-hidden" aria-label="Hero section">
                {/* Left: Text Content */}
                <div className="w-full md:w-1/2 p-12 lg:p-24 z-10 flex flex-col justify-center">
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-crisp-white leading-[1.1] mb-6">
                        PRECISION <br />
                        <span className="text-gray-500">IN EVERY CUT.</span>
                    </h1>
                    <h2 className="text-xl lg:text-2xl text-gray-300 font-light mb-8 max-w-lg">
                        EXPERTISE IN EVERY PATTERN.
                        <span className="block mt-2 text-safety-orange font-medium text-base">
                            Specialist in CO2 Laser Operating & Footwear Engineering
                        </span>
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href="#contact"
                            className="px-8 py-3 bg-safety-orange text-crisp-white font-semibold hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-safety-orange focus:ring-offset-2 focus:ring-offset-dark-slate transition-colors duration-300 tracking-wide"
                            aria-label="Start a new project"
                        >
                            START PROJECT
                        </Link>
                        <Link
                            href="#work"
                            className="px-8 py-3 border border-gray-600 text-gray-300 hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-dark-slate transition-colors duration-300 tracking-wide"
                            aria-label="View portfolio work"
                        >
                            VIEW WORK
                        </Link>
                    </div>
                </div>

                {/* Right: Portrait / Visual (Placeholder) */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-gray-900 relative">
                    <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center border-l border-gray-800 overflow-hidden">
                        {/* Decorative grid/technical lines */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none z-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                        {/* User Instructions: Place your image in public/portrait.jpg */}
                        <div className="relative w-full h-full">
                            <Image
                                src="/portrait.jpg"
                                alt="Professional Portrait"
                                fill
                                className="object-cover object-top opacity-80"

                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
