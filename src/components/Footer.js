import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="font-black text-xl text-white">Nest<span className="text-amber-500">Luck</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Lucknow's most trusted real estate platform. Find your perfect home in the City of Nawabs.
            </p>
            <div className="flex gap-3">
              {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
                <button key={i} className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors text-sm">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/properties', 'Browse Properties'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-amber-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Property Types</h4>
            <ul className="space-y-2 text-sm">
              {['Builder Floor', 'Flat / Apartment', 'Duplex', 'Independent House', 'Commercial'].map(t => (
                <li key={t}><span className="hover:text-amber-400 transition-colors cursor-pointer">{t}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Top Localities</h4>
            <ul className="space-y-2 text-sm">
              {['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Raebareli Road'].map(l => (
                <li key={l}><span className="hover:text-amber-400 transition-colors cursor-pointer">{l}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2025 NestLuck. All rights reserved. Lucknow, Uttar Pradesh.</p>
          <div className="flex gap-4">
            <span className="hover:text-amber-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-amber-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-amber-400 cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
