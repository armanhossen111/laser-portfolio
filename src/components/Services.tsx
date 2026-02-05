import { Zap, FileCode, Scissors, ScanLine } from "lucide-react";

const services = [
    {
        icon: <Zap className="w-10 h-10 text-safety-orange" />,
        title: "CO2 Laser Operation",
        description: "High-precision cutting and engraving for leather, acrylic, and textiles."
    },
    {
        icon: <ScanLine className="w-10 h-10 text-safety-orange" />,
        title: "Image Tracing & Vectorizing",
        description: "Converting hand sketches and rasters into cleaner, scalable digital vectors."
    },
    {
        icon: <Scissors className="w-10 h-10 text-safety-orange" />,
        title: "Pattern Grading",
        description: "Accurate scaling of footwear patterns across full size runs."
    },
    {
        icon: <FileCode className="w-10 h-10 text-safety-orange" />,
        title: "Marking & Engraving",
        description: "Detailed branding and functional marking on technical materials."
    }
];

export default function Services() {
    return (
        <section className="py-24 bg-zinc-900 border-t border-zinc-800" aria-labelledby="services-heading">
            <div className="container mx-auto px-6">
                <h2 id="services-heading" className="text-3xl font-bold text-center mb-16 tracking-tight">
                    TECHNICAL <span className="text-safety-orange">SERVICES</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <article
                            key={index}
                            className="group p-8 bg-dark-slate border border-zinc-700 hover:border-safety-orange focus-within:border-safety-orange transition-all duration-300"
                            aria-label={service.title}
                        >
                            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
