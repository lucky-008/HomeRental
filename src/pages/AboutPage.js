import React from 'react';
import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Arjun Mehta', role: 'CEO & Founder', avatar: '👨‍💼' },
  { name: 'Priya Srivastava', role: 'Head of Sales', avatar: '👩‍💼' },
  { name: 'Rahul Gupta', role: 'Property Advisor', avatar: '🧑‍💼' },
  { name: 'Sneha Verma', role: 'Legal Expert', avatar: '👩‍⚖️' },
];

const STATS = [
  { num: '500+', label: 'Properties Listed' },
  { num: '1,200+', label: 'Happy Clients' },
  { num: '17', label: 'Localities Covered' },
  { num: '8 Yrs', label: 'Experience' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-900 to-amber-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            About NestLuck
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6">
            Lucknow's Most <span className="text-amber-400">Trusted</span> Real Estate Platform
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Born in the City of Nawabs, NestLuck was built to make finding your perfect home in Lucknow easier, transparent, and joyful.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-amber-500 mb-1">{s.num}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At NestLuck, we believe everyone deserves to find their perfect home without stress, confusion, or hidden surprises. We're committed to transparency, trust, and technology.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our AI-powered recommendation engine learns what you love about a property and finds you more of the same — making your property search smarter with every click.
              </p>
              <Link to="/properties" className="inline-block bg-amber-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg">
                Browse Properties →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🤖', title: 'AI-Powered', desc: 'Smart recommendations based on your preferences' },
                { icon: '✅', title: 'Verified Listings', desc: 'Every property is checked and confirmed' },
                { icon: '🔒', title: 'Safe & Secure', desc: 'Your data is protected at all times' },
                { icon: '📞', title: '24/7 Support', desc: 'Our team is always available to help' },
              ].map(f => (
                <div key={f.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-500">Dedicated professionals who know Lucknow inside out</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(m => (
              <div key={m.name} className="text-center bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
                <div className="text-5xl mb-3">{m.avatar}</div>
                <h4 className="font-bold text-gray-900 mb-1">{m.name}</h4>
                <p className="text-sm text-amber-600 font-medium">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-4 bg-gradient-to-br from-amber-500 to-orange-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">Ready to Find Your Home?</h2>
          <p className="text-amber-100 mb-8 text-lg">Join thousands of happy homeowners in Lucknow</p>
          <Link to="/properties" className="inline-block bg-white text-amber-600 font-black px-10 py-4 rounded-xl hover:bg-amber-50 transition-colors shadow-xl text-lg">
            Start Searching
          </Link>
        </div>
      </div>
    </div>
  );
}
