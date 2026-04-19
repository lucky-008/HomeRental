import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import { getAllListings } from '../utils/api';
import properties from '../data/properties';

const SORT_OPTIONS = [
  { value: 'default', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'area_desc', label: 'Area: Largest First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Best Rated' },
];

const defaultFilters = {
  bhk: [], propertyType: [], constructionStatus: [], postedBy: [],
  localities: [], amenities: [], furnishing: [], purchaseType: [],
  minPrice: '', maxPrice: '', minArea: '', maxArea: '',
};

export default function PropertiesPage({ listingMode }) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('default');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getAllListings()
      .then(data => {
        if (!isMounted) return;
        setListings(Array.isArray(data.listings) ? data.listings : []);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load listings');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const formatListing = (listing) => ({
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
    image: listing.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    facilities: listing.facilities || [],
    rating: listing.rating || '4.5',
    constructionStatus: listing.constructionStatus || 'Ready to Move',
    createdAt: listing.createdAt,
  });

  const allProperties = useMemo(() => {
    return listings.length > 0 ? listings.map(formatListing) : properties;
  }, [listings]);

  const filtered = useMemo(() => {
    let result = allProperties.filter(p => {
      // Listing mode filter
      if (listingMode === 'rent' && p.listingType === 'buy') return false;
      if (listingMode === 'buy' && p.listingType === 'rent') return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.propertyType.toLowerCase().includes(q) ||
          (p.bedroomLabel && p.bedroomLabel.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      // BHK filter
      if (filters.bhk.length > 0) {
        const match = filters.bhk.some(b => {
          if (b === '5+ BHK') return p.bedrooms >= 5;
          return p.bedroomLabel === b;
        });
        if (!match) return false;
      }

      // Property type
      if (filters.propertyType.length > 0 && !filters.propertyType.includes(p.propertyType)) return false;

      // Construction status
      if (filters.constructionStatus.length > 0 && !filters.constructionStatus.includes(p.constructionStatus)) return false;

      // Posted by
      if (filters.postedBy.length > 0 && !filters.postedBy.includes(p.postedBy)) return false;

      // Localities
      if (filters.localities.length > 0 && !filters.localities.includes(p.location)) return false;

      // Furnishing
      if (filters.furnishing.length > 0 && !filters.furnishing.includes(p.furnishing)) return false;

      // Price filter
      const price = listingMode === 'rent' ? p.rentPrice : p.salePrice;
      if (filters.minPrice && price && price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && price && price > Number(filters.maxPrice)) return false;

      // Area filter
      if (filters.minArea && p.area && p.area < Number(filters.minArea)) return false;
      if (filters.maxArea && p.area && p.area > Number(filters.maxArea)) return false;

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every(a =>
          p.facilities.some(f => f.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      return true;
    });

    // Sort
    switch (sort) {
      case 'price_asc':
        result = [...result].sort((a, b) => {
          const pa = listingMode === 'rent' ? (a.rentPrice || 0) : (a.salePrice || 0);
          const pb = listingMode === 'rent' ? (b.rentPrice || 0) : (b.salePrice || 0);
          return pa - pb;
        });
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => {
          const pa = listingMode === 'rent' ? (a.rentPrice || 0) : (a.salePrice || 0);
          const pb = listingMode === 'rent' ? (b.rentPrice || 0) : (b.salePrice || 0);
          return pb - pa;
        });
        break;
      case 'area_desc':
        result = [...result].sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        result = [...result].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      default:
        break;
    }

    return result;
  }, [listingMode, searchQuery, filters, sort]);

  const activeFilterCount = Object.entries(filters).reduce((count, [key, val]) => {
    if (Array.isArray(val)) return count + val.length;
    if (val) return count + 1;
    return count;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Properties for {listingMode === 'rent' ? 'Rent' : 'Sale'} in Lucknow
              </h1>
              <p className="text-sm text-gray-500 mt-1">{filtered.length} properties found</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 sm:w-64 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />

              {/* Sort */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                🔧 Filters {activeFilterCount > 0 && <span className="bg-white text-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.bhk.map(b => (
                <span key={b} className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  {b}
                  <button onClick={() => setFilters(f => ({ ...f, bhk: f.bhk.filter(v => v !== b) }))} className="font-bold">×</button>
                </span>
              ))}
              {filters.propertyType.map(t => (
                <span key={t} className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  {t}
                  <button onClick={() => setFilters(f => ({ ...f, propertyType: f.propertyType.filter(v => v !== t) }))} className="font-bold">×</button>
                </span>
              ))}
              {filters.localities.map(l => (
                <span key={l} className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  📍 {l}
                  <button onClick={() => setFilters(f => ({ ...f, localities: f.localities.filter(v => v !== l) }))} className="font-bold">×</button>
                </span>
              ))}
              <button onClick={() => setFilters(defaultFilters)} className="text-xs text-red-500 font-semibold hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Desktop Filter */}
          <div className="hidden lg:block w-72 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} listingMode={listingMode} />
          </div>

          {/* Mobile Filter Overlay */}
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)}></div>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-gray-900">Filters</h3>
                  <button onClick={() => setShowMobileFilter(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                </div>
                <FilterSidebar filters={filters} setFilters={setFilters} listingMode={listingMode} />
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-full mt-4 bg-amber-500 text-white font-bold py-3 rounded-xl"
                >
                  Apply Filters ({filtered.length} results)
                </button>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏚️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => { setFilters(defaultFilters); setSearchQuery(''); }}
                  className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(p => (
                  <PropertyCard key={p.id} property={p} listingMode={listingMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
