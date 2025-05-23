import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6">Get the latest career tips and platform updates delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-blue-200 focus:outline-none focus:border-blue-400"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.png"
                  alt="GoRoFolio"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GoRoFolio
              </span>
            </div>
            <p className="text-blue-100/80 max-w-md mb-6 leading-relaxed">
              Your AI-powered career companion for building personal brands, optimizing resumes, and landing dream jobs in the modern job market.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <Link 
                href="#" 
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Github className="h-5 w-5 text-blue-100 group-hover:text-white transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Linkedin className="h-5 w-5 text-blue-100 group-hover:text-white transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Twitter className="h-5 w-5 text-blue-100 group-hover:text-white transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="h-5 w-5 text-blue-100 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>AI Portfolio Builder</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/preview" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>Resume Generator</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/interview" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>Mock Interview</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>Pricing</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>About Us</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>Privacy Policy</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>Terms of Service</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                  <span>Contact</span>
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200/80 text-sm">
            © 2025 GoRoFolio. All rights reserved. Built with ❤️ for modern professionals.
          </p>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/status" className="text-blue-200 hover:text-white text-sm transition-colors">
              System Status
            </Link>
            <Link href="/changelog" className="text-blue-200 hover:text-white text-sm transition-colors">
              Changelog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 