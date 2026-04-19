import React, { useState } from 'react';
import { LUCKNOW_LOCALITIES, PROPERTY_TYPES, AMENITIES_LIST } from '../data/properties';

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
const CONSTRUCTION_STATUS = ['Ready to Move', 'Under Construction', 'New Launch'];
const POSTED_BY = ['Owner', 'Builder', 'Dealer', 'Feature Dealer'];
const FURNISHING = ['Furnished', 'Semifurnished', 'Unfurnished'];
const PURCHASE_TYPE = ['Resale', 'New Booking'];

const PRICE_RANGES_BUY = [
  { label: 'No min', value: '' },
  { label: '₹10 Lac', value: 1000000 },
  { label: '₹25 Lac', value: 2500000 },
  { label: '₹50 Lac', value: 5000000 },
  { label: '₹75 Lac', value: 7500000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2 Cr', value: 20000000 },
];

const PRICE_RANGES_RENT = [
  { label: 'No min', value: '' },
  { label: '₹5,000', value: 5000 },
  { label: '₹10,000', value: 10000 },
  { label: '₹20,000', value: 20000 },
  { label: '₹30,000', value: 30000 },
  { label: '₹50,000', value: 50000 },
];

const AREA_OPTIONS = [
  { label: 'No min', value: '' },
  { label: '300 sq.ft', value: 300 },
  { label: '500 sq.ft', value: 500 },
  { label: '800 sq.ft', value: 800 },
  { label: '1000 sq.ft', value: 1000 },
  { label: '1500 sq.ft', value: 1500 },
  { label: '2000 sq.ft', value: 2000 },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-bold text-gray-800 text-sm mb-3"
      >
        {title}
        <span className="text-gray-400 text-lg">{open ? '∧' : '∨'}</span>
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ filters, setFilters, listingMode }) {
  const priceRanges = listingMode === 'rent' ? PRICE_RANGES_RENT : PRICE_RANGES_BUY;

  const toggleArr = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val]
    }));
  };

  const clearAll = () => {
    setFilters({
      bhk: [], propertyType: [], constructionStatus: [], postedBy: [],
      localities: [], amenities: [], furnishing: [], purchaseType: [],
      minPrice: '', maxPrice: '', minArea: '', maxArea: '',
    });
  };

  const Tag = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
        active
          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
          : 'border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600'
      }`}
    >
      {active ? '✓' : '+'} {label}
    </button>
  );

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-black text-gray-900 text-base">Filters</h2>
        <button onClick={clearAll} className="text-xs text-amber-600 font-semibold hover:underline">
          Clear All
        </button>
      </div>

      {/* Budget */}
      <FilterSection title="Budget">
        <div className="flex gap-2">
          <select
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="flex-1 text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-amber-400"
          >
            {priceRanges.map(p => <option key={p.label} value={p.value}>{p.label}</option>)}
          </select>
          <select
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="flex-1 text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-amber-400"
          >
            {[...priceRanges.slice(1), { label: 'No max', value: '' }].reverse().map(p => (
              <option key={p.label} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Type of Property">
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(t => (
            <Tag key={t} label={t} active={filters.propertyType.includes(t)} onClick={() => toggleArr('propertyType', t)} />
          ))}
        </div>
      </FilterSection>

      {/* BHK */}
      <FilterSection title="No. of Bedrooms">
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map(b => (
            <Tag key={b} label={b} active={filters.bhk.includes(b)} onClick={() => toggleArr('bhk', b)} />
          ))}
        </div>
      </FilterSection>

      {/* Construction Status */}
      <FilterSection title="Construction Status">
        <div className="flex flex-wrap gap-2">
          {CONSTRUCTION_STATUS.map(s => (
            <Tag key={s} label={s} active={filters.constructionStatus.includes(s)} onClick={() => toggleArr('constructionStatus', s)} />
          ))}
        </div>
      </FilterSection>

      {/* Posted By */}
      <FilterSection title="Posted By">
        <div className="flex flex-wrap gap-2">
          {POSTED_BY.map(p => (
            <Tag key={p} label={p} active={filters.postedBy.includes(p)} onClick={() => toggleArr('postedBy', p)} />
          ))}
        </div>
      </FilterSection>

      {/* Area */}
      <FilterSection title="Area (sq.ft.)">
        <div className="flex gap-2">
          <select
            value={filters.minArea}
            onChange={e => setFilters(f => ({ ...f, minArea: e.target.value }))}
            className="flex-1 text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-amber-400"
          >
            {AREA_OPTIONS.map(a => <option key={a.label} value={a.value}>{a.label}</option>)}
          </select>
          <select
            value={filters.maxArea}
            onChange={e => setFilters(f => ({ ...f, maxArea: e.target.value }))}
            className="flex-1 text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-amber-400"
          >
            {[...AREA_OPTIONS.slice(1), { label: 'No max', value: '' }].reverse().map(a => (
              <option key={a.label} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Localities */}
      <FilterSection title="Localities" defaultOpen={false}>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {LUCKNOW_LOCALITIES.map(loc => (
            <label key={loc} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.localities.includes(loc)}
                onChange={() => toggleArr('localities', loc)}
                className="accent-amber-500 w-3.5 h-3.5"
              />
              <span className="text-xs text-gray-600 group-hover:text-amber-600">{loc}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Purchase Type */}
      <FilterSection title="Purchase Type" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {PURCHASE_TYPE.map(pt => (
            <Tag key={pt} label={pt} active={filters.purchaseType.includes(pt)} onClick={() => toggleArr('purchaseType', pt)} />
          ))}
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map(a => (
            <Tag key={a} label={a} active={filters.amenities.includes(a)} onClick={() => toggleArr('amenities', a)} />
          ))}
        </div>
      </FilterSection>

      {/* Furnishing */}
      <FilterSection title="Furnishing Status" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {FURNISHING.map(f => (
            <Tag key={f} label={f} active={filters.furnishing.includes(f)} onClick={() => toggleArr('furnishing', f)} />
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
