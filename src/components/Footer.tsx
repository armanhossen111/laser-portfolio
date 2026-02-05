import { Linkedin, Instagram, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-gray-400 border-t border-zinc-900 py-12">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Brand */}
                <div className="text-center md:text-left">
                    <h4 className="text-white font-bold tracking-wider uppercase mb-1">MD Arman Laser Craft</h4>
                    <p className="text-xs text-zinc-600">Precision Engineering & Design</p>
                </div>

                {/* Socials */}
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-safety-orange transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="hover:text-safety-orange transition-colors">
                        <Instagram className="w-5 h-5" />
                    </Link>
                    <Link href="mailto:mdarmanhosseny2003@gmail.com" className="hover:text-safety-orange transition-colors">
                        <Mail className="w-5 h-5" />
                    </Link>
                </div>

                {/* Copyright */}
                <div className="text-xs text-zinc-600">
                    &copy; {new Date().getFullYear()} All Rights Reserved.
                </div>

            </div>
        </footer>
    );
}
