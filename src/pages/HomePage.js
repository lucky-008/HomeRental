import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import properties from '../data/properties';
import { getTrendingProperties } from '../utils/recommendations';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80",
];

const PROPERTY_CATEGORIES = [
  { icon: '🏢', label: 'Apartments', desc: 'Ready to move-in', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80' },
  { icon: '🏠', label: 'Builder Floors', desc: 'Freehold independence', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80' },
  { icon: '🏗️', label: 'Under Construction', desc: 'Best price deals', img: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=400&q=80' },
  { icon: '🏛️', label: 'Duplex', desc: 'Spacious living', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80' },
  { icon: '🏘️', label: 'Townships', desc: 'Community living', img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80' },
  { icon: '💼', label: 'Commercial', desc: 'Office & shops', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80' },
];

const SERVICES = [
  { icon: '🏷️', title: 'Sell Your Home', desc: 'Get the best market price with our expert agents.' },
  { icon: '🏦', title: 'Home Loans', desc: 'Free consultancy to get you the right loan.' },
  { icon: '🔍', title: 'Home Inspection', desc: 'We make sure you get exactly what was promised.' },
  { icon: '⚖️', title: 'Legal Services', desc: 'Expert legal help for all property-related matters.' },
];

const LOCALITIES = [
  { name: 'Gomti Nagar', props: 42, img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=300&q=80' },
  { name: 'Hazratganj', props: 31, img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&q=80' },
  { name: 'Aliganj', props: 28, img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=300&q=80' },
  { name: 'Indira Nagar', props: 55, img: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=300&q=80' },
  { name: 'Kanpur Road', props: 19, img: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=300&q=80' },
  { name: 'Mahanagar', props: 37, img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=300&q=80' },
];

export default function HomePage({ listingMode, setListingMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImg] = useState(0);
  const navigate = useNavigate();

  const trending = getTrendingProperties(properties, listingMode, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={HERO_IMAGES[heroImg]}
          alt="Lucknow Properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-amber-900/40"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto mt-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span>📍</span> Lucknow's #1 Real Estate Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
            Find Your <span className="text-amber-400">Dream Home</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Explore {properties.length}+ verified properties across Lucknow's finest localities
          </p>

          {/* Search Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/20">
            {/* Mode Tabs */}
            <div className="flex gap-1 mb-3 bg-white/10 rounded-xl p-1">
              {['buy', 'rent'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setListingMode(mode)}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-sm capitalize transition-all ${
                    listingMode === mode
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {mode === 'buy' ? '🏠 Buy' : '🔑 Rent'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search by locality, property name or type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-white text-gray-800 rounded-xl px-4 py-3.5 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg text-sm whitespace-nowrap"
              >
                🔍 Search Listings
              </button>
            </form>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {['Gomti Nagar', 'Hazratganj', '2 BHK', '3 BHK', 'Gated Society'].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setSearchQuery(tag); navigate(`/properties?search=${encodeURIComponent(tag)}`); }}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full border border-white/30 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[['20+', 'Properties'], ['17', 'Localities'], ['100%', 'Verified']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{num}</div>
                <div className="text-xs text-gray-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-500">NestLuck offers you the best real estate services in Lucknow</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(s => (
              <div key={s.title} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group bg-white">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-amber-500 transition-colors group-hover:scale-110">
                  <span className="group-hover:grayscale-0">{s.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{s.desc}</p>
                <button className="text-sm text-amber-600 font-semibold hover:underline">Learn more →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Type */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Explore by Type</h2>
            <p className="text-gray-500">Discover properties by category across Lucknow</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PROPERTY_CATEGORIES.map(cat => (
              <div
                key={cat.label}
                onClick={() => navigate(`/properties?type=${encodeURIComponent(cat.label)}`)}
                className="relative overflow-hidden rounded-2xl h-44 cursor-pointer group"
              >
                <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-white font-bold text-sm">{cat.label}</h3>
                      <p className="text-gray-300 text-xs">{cat.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Properties */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
                {listingMode === 'rent' ? 'Properties for Rent' : 'Properties for Sale'}
              </h2>
              <p className="text-gray-500">Top-rated listings in Lucknow</p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg"
            >
              View All Properties →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map(p => (
              <PropertyCard key={p.id} property={p} listingMode={listingMode} />
            ))}
          </div>
        </div>
      </section>

      {/* Localities */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Top Localities</h2>
            <p className="text-gray-500">Explore Lucknow's most sought-after neighbourhoods</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {LOCALITIES.map(loc => (
              <div
                key={loc.name}
                onClick={() => navigate(`/properties?search=${encodeURIComponent(loc.name)}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer group transition-all hover:-translate-y-1"
              >
                <div className="h-28 overflow-hidden">
                  <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3 text-center">
                  <p className="font-bold text-gray-900 text-sm">{loc.name}</p>
                  <p className="text-xs text-gray-400">{loc.props}+ properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">List Your Property</h2>
          <p className="text-amber-100 text-lg mb-8">Reach thousands of buyers and renters in Lucknow</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-white text-amber-600 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition-colors shadow-lg text-sm">
              + Add Your Listing
            </button>
            <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
