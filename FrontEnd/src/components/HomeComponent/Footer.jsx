import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold font-serif mb-4 text-white">
              LearnApp
            </h3>
            <p className="text-gray-400">
              Empowering learners worldwide with quality online education.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-[#d1e1e3]">
                  Home
                </a>
              </li>
              <li>
                <a href="/courses" className="hover:text-[#d1e1e3]">
                  Courses
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#d1e1e3]">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#d1e1e3]">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: info@learnapp.com</p>
            <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
            <p className="text-gray-400">
              Address: 123 Education St, Knowledge City
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#d1e1e3]">
                Facebook
              </a>
              <a href="#" className="hover:text-[#d1e1e3]">
                Twitter
              </a>
              <a href="#" className="hover:text-[#d1e1e3]">
                LinkedIn
              </a>
              <a href="#" className="hover:text-[#d1e1e3]">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2023 LearnApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
