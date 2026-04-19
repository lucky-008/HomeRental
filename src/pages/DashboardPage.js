import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { getSavedProperties, getMessages, getShares, getUserListings, getAllListings, deleteListing } from '../utils/api';
import properties from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import CreateListingModal from '../components/CreateListingModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [messages, setMessages] = useState([]);
  const [shares, setShares] = useState([]);
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [savedData, messagesData, sharesData, listingsData, allListingsData] = await Promise.all([
        getSavedProperties(user.username),
        getMessages(user.username),
        getShares(user.username),
        getUserListings(user.username),
        getAllListings()
      ]);
      setSaved(savedData.savedProperties || []);
      setMessages(messagesData.messages || []);
      setShares(sharesData.shares || []);
      setListings(listingsData.listings || []);
      setAllListings(allListingsData.listings || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [user, fetchData]);

  // Expose refresh function for PropertyCard to call
  useEffect(() => {
    window.dashboardRefresh = fetchData;
    return () => delete window.dashboardRefresh;
  }, [fetchData]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-center p-4">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    </div>;
  }

  // User's own listings (from backend)
  const listed = listings || [];
  const savedListings = allListings.filter(l => saved.includes(String(l._id)));
  const savedProps = savedListings.map(l => ({
    id: String(l._id),
    name: l.name,
    location: l.location,
    fullAddress: `${l.name}, ${l.location || 'Lucknow'}`,
    image: l.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    propertyType: l.propertyType,
    bedroomLabel: l.bedrooms ? `${l.bedrooms} BHK` : '',
    areaLabel: l.area ? `${l.area} Sq.Ft.` : '',
    salePriceDisplay: l.salePrice ? `₹${(l.salePrice / 100000).toFixed(2)} Lac` : 'On Request',
    rentPriceDisplay: l.rentPrice ? `₹${l.rentPrice.toLocaleString('en-IN')}/month` : '',
    rating: '4.5',
    isFeatured: false,
    isNew: true,
    constructionStatus: l.constructionStatus || 'Ready to Move',
    postedBy: l.username,
    furnishing: l.furnishing || 'Unfurnished',
    possession: l.possession || 'Immediate',
    phone: l.phone || '',
    description: l.description || 'Property description',
    facilities: l.facilities || [],
    listingType: l.listingType || 'both'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">👤 Your Dashboard</h1>
            <p className="text-gray-600">Welcome back, <span className="font-bold text-amber-600">{user.username}</span>!</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateListingModal(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
              title="Create a new property listing"
            >
              ➕ New Listing
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
              title="Refresh dashboard"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-black text-amber-500 mb-2">{listed.length}</div>
            <p className="text-sm font-semibold text-gray-600">Listed Properties</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-black text-blue-500 mb-2">{savedProps.length}</div>
            <p className="text-sm font-semibold text-gray-600">Saved Properties</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-black text-green-500 mb-2">{messages.filter(m => !m.isRead).length}</div>
            <p className="text-sm font-semibold text-gray-600">New Messages</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl font-black text-purple-500 mb-2">{shares.length}</div>
            <p className="text-sm font-semibold text-gray-600">Shared Properties</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {['overview', 'listed', 'saved', 'messages', 'shares'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Listed Properties */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Your Listed Properties</h2>
                    {listed.length > 0 && (
                      <button
                        onClick={() => setShowCreateListingModal(true)}
                        className="text-sm bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        ➕ Add Property
                      </button>
                    )}
                  </div>
                  {listed.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-gray-500 mb-3">No properties listed yet.</p>
                      <button
                        onClick={() => setShowCreateListingModal(true)}
                        className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                      >
                        ➕ Create First Listing
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {listed.map(p => (
                        <div key={p._id} className="relative">
                          <PropertyCard
                            property={{
                              id: p._id,
                              name: p.name,
                              location: p.location,
                              fullAddress: `${p.name}, ${p.location}, Lucknow`,
                              image: p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
                              propertyType: p.propertyType,
                              bedroomLabel: p.bedrooms ? `${p.bedrooms} BHK` : '',
                              areaLabel: p.area ? `${p.area} Sq.Ft.` : '',
                              salePriceDisplay: p.salePrice ? `₹${(p.salePrice / 100000).toFixed(2)} Lac` : 'On Request',
                              rentPriceDisplay: p.rentPrice ? `₹${p.rentPrice.toLocaleString('en-IN')}/month` : '',
                              rating: '4.5',
                              isFeatured: false,
                              isNew: true,
                              constructionStatus: 'Ready to Move',
                              postedBy: user.username,
                              furnishing: p.furnishing || 'Unfurnished',
                              possession: p.possession || 'Immediate',
                              phone: p.phone || '',
                              description: p.description || 'Property description',
                              facilities: []
                            }}
                            listingMode={p.listingType || 'both'}
                            onSave={fetchData}
                          />
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this listing?')) {
                                try {
                                  await deleteListing(p._id);
                                  fetchData();
                                } catch (err) {
                                  alert('Failed to delete listing');
                                }
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg"
                            title="Delete listing"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Properties */}
                <div className="pt-8 border-t border-gray-100">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Your Saved Properties</h2>
                  {savedProps.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No saved properties yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedProps.map(p => <PropertyCard key={p.id} property={p} listingMode={p.listingType} onSave={fetchData} />)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Listed Properties Tab */}
            {activeTab === 'listed' && (
              <div>
                {listed.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-500 mb-3">No properties listed by you.</p>
                    <button
                      onClick={() => setShowCreateListingModal(true)}
                      className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                      ➕ Create First Listing
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listed.map(p => (
                      <div key={p._id} className="relative">
                        <PropertyCard
                          property={{
                            id: p._id,
                            name: p.name,
                            location: p.location,
                            fullAddress: `${p.name}, ${p.location}, Lucknow`,
                            image: p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
                            propertyType: p.propertyType,
                            bedroomLabel: p.bedrooms ? `${p.bedrooms} BHK` : '',
                            areaLabel: p.area ? `${p.area} Sq.Ft.` : '',
                            salePriceDisplay: p.salePrice ? `₹${(p.salePrice / 100000).toFixed(2)} Lac` : 'On Request',
                            rentPriceDisplay: p.rentPrice ? `₹${p.rentPrice.toLocaleString('en-IN')}/month` : '',
                            rating: '4.5',
                            isFeatured: false,
                            isNew: true,
                            constructionStatus: 'Ready to Move',
                            postedBy: user.username,
                            furnishing: p.furnishing || 'Unfurnished',
                            possession: p.possession || 'Immediate',
                            phone: p.phone || '',
                            description: p.description || 'Property description',
                            facilities: []
                          }}
                          listingMode={p.listingType || 'both'}
                          onSave={fetchData}
                        />
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this listing?')) {
                              try {
                                await deleteListing(p._id);
                                fetchData();
                              } catch (err) {
                                alert('Failed to delete listing');
                              }
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg"
                          title="Delete listing"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved' && (
              <div>
                {savedProps.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No saved properties.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedProps.map(p => <PropertyCard key={p.id} property={p} listingMode={p.listingType} onSave={fetchData} />)}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No messages yet.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map(msg => (
                      <div key={msg._id} className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        msg.isRead ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-200'
                      }`} onClick={() => setExpandedMessage(expandedMessage === msg._id ? null : msg._id)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{msg.from}</p>
                              {!msg.isRead && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">New</span>}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">📍 {msg.propertyName}</p>
                            {expandedMessage === msg._id && (
                              <p className="text-sm text-gray-700 mt-3 p-3 bg-white rounded border border-gray-100">{msg.message}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 shrink-0 ml-4">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Shares Tab */}
            {activeTab === 'shares' && (
              <div>
                {shares.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No properties shared with you.</p>
                ) : (
                  <div className="space-y-3">
                    {shares.map(share => (
                      <div key={share._id} className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 mb-1">{share.from} shared a property</p>
                            <p className="text-sm text-gray-600">📍 {share.propertyName}</p>
                            {share.message && (
                              <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border border-gray-100">"{share.message}"</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 shrink-0 ml-4">
                            {new Date(share.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateListingModal && (
        <CreateListingModal
          user={user}
          onClose={() => {
            setShowCreateListingModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
