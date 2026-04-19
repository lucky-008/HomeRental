import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { useSavedProperties } from '../hooks/useSavedProperties';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import properties from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import { getRecommendations, getSimilarByLocation } from '../utils/recommendations';
import { getListing } from '../utils/api';

const mapListingToProperty = (listing) => ({
  id: String(listing._id),
  name: listing.name,
  location: listing.location || 'Lucknow',
  fullAddress: listing.fullAddress || `${listing.name}, ${listing.location || 'Lucknow'}`,
  description: listing.description || '',
  propertyType: listing.propertyType || 'Flat/Apartment',
  bedrooms: listing.bedrooms,
  bedroomLabel: listing.bedrooms ? `${listing.bedrooms} BHK` : '',
  area: listing.area,
  areaLabel: listing.area ? `${listing.area} Sq.Ft.` : '',
  salePrice: listing.salePrice,
  salePriceDisplay: listing.salePrice ? `₹${(listing.salePrice / 100000).toFixed(2)} Lac` : '',
  rentPrice: listing.rentPrice,
  rentPriceDisplay: listing.rentPrice ? `₹${listing.rentPrice.toLocaleString('en-IN')}/month` : '',
  listingType: listing.listingType || 'both',
  furnishing: listing.furnishing || 'Unfurnished',
  possession: listing.possession || 'Immediate',
  image: listing.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  facilities: listing.facilities || [],
  rating: listing.rating || '4.5',
  constructionStatus: listing.constructionStatus || 'Ready to Move',
  postedBy: listing.username || 'Agent',
  agentName: listing.agentName || listing.username || 'Agent',
  phone: listing.phone || '',
  googleMapLink: listing.googleMapLink || ''
});

export default function PropertyDetailPage({ listingMode }) {
  const { user } = useAuth();
  const { saved, save, loading } = useSavedProperties();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [property, setProperty] = useState(() => {
    const staticProperty = properties.find(p => p.id === parseInt(id));
    return staticProperty || null;
  });
  const [loadingProperty, setLoadingProperty] = useState(property ? false : true);
  const [detailError, setDetailError] = useState(null);

  const mode = location.state?.listingMode || listingMode;

  useEffect(() => {
    if (property) return;
    let isMounted = true;
    setLoadingProperty(true);
    getListing(id)
      .then(data => {
        if (!isMounted) return;
        if (data.listing) {
          setProperty(mapListingToProperty(data.listing));
        } else {
          setDetailError('Property not found');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setDetailError(err.message || 'Failed to load property');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingProperty(false);
      });
    return () => { isMounted = false; };
  }, [id, property]);

  if (loadingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <div className="text-3xl font-black text-gray-900 mb-2">Loading property…</div>
        </div>
      </div>
    );
  }

  if (!property || detailError) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🏚️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Property not found</h2>
          <p className="text-gray-500 mb-4">{detailError || 'This property does not exist.'}</p>
          <Link to="/properties" className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendations(property, properties, mode, 3);
  const nearbyProps = getSimilarByLocation(property, properties, 2);

  const price = mode === 'rent' ? property.rentPriceDisplay : property.salePriceDisplay;
  const facilities = property.facilities.filter(Boolean);

  // ...existing JSX and logic...

  const facilityIcons = {
    'Lift': '🛗', 'Swimming Pool': '🏊', 'Gated Society': '🔐', 'Power Back-up': '⚡',
    'CCTV': '📹', 'Parking': '🚗', 'Gymnasium': '💪', 'Security Guard': '💂',
    'Vaastu': '🕉️', 'Garden': '🌿', 'Roof': '🏠', 'Piped-gas': '🔥', 'Visitor': '👥',
  };

  function getFacilityIcon(f) {
    for (const [key, icon] of Object.entries(facilityIcons)) {
      if (f.toLowerCase().includes(key.toLowerCase())) return icon;
    }
    return '✅';
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-amber-500">Home</Link>
            <span>›</span>
            <Link to="/properties" className="hover:text-amber-500">Properties</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{property.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 shadow-lg">
              <img
                src={imgError ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' : property.image}
                alt={property.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {property.isFeatured && <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Featured</span>}
                <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{property.propertyType}</span>
              </div>

              {/* Mode badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${mode === 'rent' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                  {mode === 'rent' ? '🔑 For Rent' : '🏠 For Sale'}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <p className="text-white/70 text-xs">{mode === 'rent' ? 'Monthly Rent' : 'Sale Price'}</p>
                  <p className="text-white font-black text-2xl">{price || 'Price on Request'}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1.5 rounded-full">
                  <span className="text-sm">★</span>
                  <span className="font-bold text-sm">{property.rating}</span>
                </div>
              </div>
            </div>

            {/* Title & Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-black text-gray-900 mb-2">{property.name}</h1>
              <p className="text-gray-500 flex items-center gap-2 mb-4">
                <span>📍</span>
                <span>{property.fullAddress}</span>
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                {property.bedroomLabel && (
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                    <span className="text-xl">🛏</span>
                    <div>
                      <p className="text-gray-400 text-xs">Bedrooms</p>
                      <p className="font-bold text-gray-800">{property.bedroomLabel}</p>
                    </div>
                  </div>
                )}
                {property.areaLabel && (
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                    <span className="text-xl">📐</span>
                    <div>
                      <p className="text-gray-400 text-xs">Area</p>
                      <p className="font-bold text-gray-800">{property.areaLabel}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                  <span className="text-xl">🏗️</span>
                  <div>
                    <p className="text-gray-400 text-xs">Status</p>
                    <p className="font-bold text-gray-800">{property.constructionStatus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-gray-400 text-xs">Possession</p>
                    <p className="font-bold text-gray-800">{property.possession || 'Immediate'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                  <span className="text-xl">🛋️</span>
                  <div>
                    <p className="text-gray-400 text-xs">Furnishing</p>
                    <p className="font-bold text-gray-800">{property.furnishing}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['overview', 'details', 'map'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'overview' ? '📋 Overview' : tab === 'details' ? '🔍 Details' : '🗺️ Map'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">About this Property</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {property.description || `This well-maintained ${property.bedroomLabel} property is located in ${property.location}, one of Lucknow's prime residential areas. Perfect for families looking for comfort and convenience, this property offers an excellent opportunity in the heart of Lucknow.`}
                    </p>

                    {facilities.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-bold text-gray-900 mb-3">Top Facilities & Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {facilities.slice(0, 12).map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                              <span>{getFacilityIcon(f)}</span>
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 mb-4">Property Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        ['Property Type', property.propertyType],
                        ['Bedrooms', property.bedroomLabel || 'N/A'],
                        ['Total Area', property.areaLabel || 'N/A'],
                        ['Location', property.location + ', Lucknow, U.P.'],
                        ['Possession', property.possession || 'Immediate'],
                        ['Construction Status', property.constructionStatus],
                        ['Furnishing', property.furnishing],
                        ['Posted By', property.postedBy],
                        ['Sale Price', property.salePriceDisplay || 'On Request'],
                        ['Rent / Month', property.rentPriceDisplay || 'N/A'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                          <span className="text-gray-500">{label}</span>
                          <span className="font-semibold text-gray-800 text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'map' && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Location</h3>
                    {property.googleMapLink ? (
                      <div className="rounded-xl overflow-hidden h-64 bg-gray-100">
                        <iframe
                          src={`https://maps.google.com/maps?q=${property.location},Lucknow,UP&z=14&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          title="Property location"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-gray-100 h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🗺️</div>
                          <p className="text-gray-500 text-sm">{property.location}, Lucknow, Uttar Pradesh</p>
                          <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(property.location + ', Lucknow, UP')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-xs bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Open in Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ML Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">AI Recommendations</h3>
                    <p className="text-sm text-gray-500">If you liked this property, you'll love these similar ones</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendations.map(p => (
                    <PropertyCard key={p.id} property={p} listingMode={mode} />
                  ))}
                </div>
              </div>
            )}

            {/* Nearby */}
            {nearbyProps.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-900 mb-4">📍 More in {property.location}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyProps.map(p => (
                    <PropertyCard key={p.id} property={p} listingMode={mode} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${mode === 'rent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {mode === 'rent' ? '🔑 Rent' : '🏠 Buy'}
                </span>
                <span className="text-xs text-gray-400">{property.propertyType}</span>
              </div>
              <p className="text-3xl font-black text-amber-600 mb-1">
                {price || 'On Request'}
              </p>
              {mode !== 'rent' && property.rentPriceDisplay && (
                <p className="text-sm text-gray-500 mb-4">Also available for rent at {property.rentPriceDisplay}</p>
              )}
              {mode === 'rent' && property.salePriceDisplay && (
                <p className="text-sm text-gray-500 mb-4">Also for sale at {property.salePriceDisplay}</p>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-100"
                >
                  {showContact ? '🙈 Hide Contact' : '📞 View Contact'}
                </button>

                {showContact && (
                  <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                    <p className="font-bold text-gray-900">{property.agentName}</p>
                    <p className="text-amber-600 font-black text-lg mt-1">{property.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">{property.postedBy}</p>
                  </div>
                )}


                <button
                  className="w-full border-2 border-amber-500 text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition-colors"
                  onClick={() => {
                    if (!user) {
                      alert('Please sign in to send a message.');
                      return;
                    }
                    const msg = prompt('Enter your message for the agent:');
                    if (msg) alert('Message sent! (Demo only)');
                  }}
                >
                  💬 Send Message
                </button>

                <div className="flex gap-2">
                  <button
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 text-sm"
                    disabled={loading}
                    onClick={async () => {
                      if (!user) {
                        alert('Please sign in to save properties.');
                        return;
                      }
                      await save(property.id);
                      if (window.dashboardRefresh) {
                        window.dashboardRefresh();
                      }
                      alert('Property saved!');
                    }}
                  >
                    {user && saved && saved.includes(property.id) ? '❤️ Saved' : '♡ Save'}
                  </button>
                  <button
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 text-sm"
                    onClick={async () => {
                      if (!user) {
                        alert('Please sign in to share properties.');
                        return;
                      }
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      } catch {
                        alert('Failed to copy link.');
                      }
                    }}
                  >
                    ↗ Share
                  </button>
                </div>
              </div>

              {/* Agent card */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                    {property.agentName ? property.agentName[0] : 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{property.agentName || 'Agent'}</p>
                    <p className="text-xs text-gray-500">{property.postedBy}</p>
                    <div className="flex text-amber-400 text-xs mt-0.5">{'★'.repeat(5)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="font-bold text-gray-900 mb-4 text-sm">Property Highlights</h4>
              <div className="space-y-3">
                {[
                  ['🏷️', 'Property Type', property.propertyType],
                  ['📐', 'Carpet Area', property.areaLabel || 'N/A'],
                  ['🛏️', 'Configuration', property.bedroomLabel || 'N/A'],
                  ['📅', 'Possession', property.possession || 'Immediate'],
                  ['🛋️', 'Furnishing', property.furnishing],
                  ['⭐', 'Rating', `${property.rating}/5.0`],
                ].map(([icon, label, value]) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5"><span>{icon}</span>{label}</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
