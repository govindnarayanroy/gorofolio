import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        {/* Newsletter Section */}
        <div className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-4 text-2xl font-bold">Stay Updated</h3>
            <p className="mb-6 text-blue-100">
              Get the latest career tips and platform updates delivered to your inbox
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm placeholder:text-blue-200 focus:border-blue-400 focus:outline-none"
              />
              <button className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium transition-all duration-300 hover:from-blue-500 hover:to-purple-500">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/images/logo.png" alt="GoRoFolio" fill className="object-contain" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                GoRoFolio
              </span>
            </div>
            <p className="mb-6 max-w-md leading-relaxed text-blue-100/80">
              Your AI-powered career companion for building personal brands, optimizing resumes, and
              landing dream jobs in the modern job market.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <Link
                href="#"
                className="group rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <Github className="h-5 w-5 text-blue-100 transition-colors group-hover:text-white" />
              </Link>
              <Link
                href="#"
                className="group rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <Linkedin className="h-5 w-5 text-blue-100 transition-colors group-hover:text-white" />
              </Link>
              <Link
                href="#"
                className="group rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <Twitter className="h-5 w-5 text-blue-100 transition-colors group-hover:text-white" />
              </Link>
              <Link
                href="#"
                className="group rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <Mail className="h-5 w-5 text-blue-100 transition-colors group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/dashboard"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>AI Portfolio Builder</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/preview"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>Resume Generator</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/interview"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>Mock Interview</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>Pricing</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>About Us</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>Privacy Policy</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>Terms of Service</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group flex items-center text-blue-200 transition-colors duration-300 hover:text-white"
                >
                  <span>Contact</span>
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-blue-200/80">
            © 2025 GoRoFolio. All rights reserved. Built with ❤️ for modern professionals.
          </p>

          <div className="mt-4 flex items-center gap-6 md:mt-0">
            <Link
              href="/status"
              className="text-sm text-blue-200 transition-colors hover:text-white"
            >
              System Status
            </Link>
            <Link
              href="/changelog"
              className="text-sm text-blue-200 transition-colors hover:text-white"
            >
              Changelog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
