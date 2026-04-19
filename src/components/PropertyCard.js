import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { useSavedProperties } from '../hooks/useSavedProperties';
import { Link } from 'react-router-dom';
import MessageModal from './MessageModal';
import ShareModal from './ShareModal';

export default function PropertyCard({ property, listingMode, onSave }) {
  const [imgError, setImgError] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useAuth();
  const { saved, save, loading } = useSavedProperties();
  const liked = user && saved.includes(String(property.id));
  const owner = property.postedBy || 'Property Owner';

  const price = listingMode === 'rent'
    ? (property.rentPriceDisplay || property.salePriceDisplay)
    : property.salePriceDisplay;

  const priceLabel = listingMode === 'rent' ? '/mo' : '';

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save properties.');
      return;
    }
    await save(property.id);
    if (onSave) {
      setTimeout(() => onSave(), 500); // Small delay to ensure backend is updated
    }
  };

  const handleMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to send messages.');
      return;
    }
    setShowMessageModal(true);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to share properties.');
      return;
    }
    setShowShareModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:-translate-y-1">
        {/* Image */}
        <div className="relative overflow-hidden h-52">
          <img
            src={imgError ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80' : property.image}
            alt={property.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.isFeatured && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Featured</span>
            )}
            {property.isNew && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">New</span>
            )}
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
              {listingMode === 'rent' ? 'Rent' : 'Buy'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform disabled:opacity-50"
              title={liked ? 'Remove from saved' : 'Save property'}
            >
              <span className={`text-sm ${liked ? 'text-red-500' : 'text-gray-400'}`}>{liked ? '❤️' : '🤍'}</span>
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
              title="Share property"
            >
              <span className="text-sm">🔗</span>
            </button>
            <button
              onClick={handleMessage}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
              title="Send message"
            >
              <span className="text-sm">💬</span>
            </button>
          </div>

          {/* Property type */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-2 py-0.5 rounded-full">
              {property.propertyType}
            </span>
          </div>
        </div>

        {/* Content */}
        <Link to={`/property/${property.id}`} state={{ listingMode }}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
                {property.name}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                <span className="text-amber-400 text-xs">★</span>
                <span className="text-xs font-semibold text-amber-700">{property.rating}</span>
              </div>
            </div>

            <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
              <span>📍</span>
              <span className="truncate">{property.location}, Lucknow</span>
            </p>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 border-t border-gray-50 pt-3">
              {property.bedroomLabel && (
                <span className="flex items-center gap-1">
                  <span>🛏</span> {property.bedroomLabel}
                </span>
              )}
              {property.areaLabel && (
                <span className="flex items-center gap-1">
                  <span>📐</span> {property.areaLabel}
                </span>
              )}
              {property.constructionStatus && (
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${property.constructionStatus === 'Ready to Move' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {property.constructionStatus}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{listingMode === 'rent' ? 'Monthly Rent' : 'Sale Price'}</p>
                <p className="text-lg font-black text-amber-600">
                  {price || 'Price on Request'}
                  <span className="text-xs font-normal text-gray-400">{priceLabel}</span>
                </p>
              </div>
              <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center group-hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100">
                <span className="text-white text-sm">→</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {showMessageModal && (
        <MessageModal
          property={property}
          user={user}
          owner={owner}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {showShareModal && (
        <ShareModal
          property={property}
          user={user}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}
