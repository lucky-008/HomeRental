/**
 * Property Recommendation Engine
 * Uses content-based filtering with cosine similarity
 * Features: bedrooms, area, price, property type, location, facilities
 */

function normalize(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function buildFeatureVector(property, allProperties, listingMode = 'buy') {
  const allPrices = allProperties.map(p => listingMode === 'rent' ? (p.rentPrice || 0) : (p.salePrice || 0)).filter(Boolean);
  const allAreas = allProperties.map(p => p.area || 0).filter(Boolean);
  const allBedrooms = allProperties.map(p => p.bedrooms || 0).filter(Boolean);

  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const minArea = Math.min(...allAreas);
  const maxArea = Math.max(...allAreas);
  const minBed = Math.min(...allBedrooms);
  const maxBed = Math.max(...allBedrooms);

  const price = listingMode === 'rent' ? (property.rentPrice || 0) : (property.salePrice || 0);

  // Numerical features (weighted)
  const features = [
    normalize(property.bedrooms || 0, minBed, maxBed) * 3,     // bedrooms (high weight)
    normalize(property.area || 0, minArea, maxArea) * 2,         // area (medium weight)
    normalize(price, minPrice, maxPrice) * 2.5,                  // price (high weight)
  ];

  // One-hot encode property type
  const types = ["Builder Floor", "Duplex Builder Floor", "Flat/Apartment", "Independent House"];
  types.forEach(t => features.push(property.propertyType === t ? 1.5 : 0));

  // One-hot encode location
  const locations = [...new Set(allProperties.map(p => p.location))];
  locations.forEach(l => features.push(property.location === l ? 2 : 0));

  // Facility overlap score
  const allFacilities = ["Lift", "Swimming Pool", "Gated Society", "Power Back-up", "CCTV Surveillance", "Parking", "Gymnasium", "Security Guard", "Vaastu Compliant"];
  allFacilities.forEach(f => {
    features.push(property.facilities.some(fac => fac.toLowerCase().includes(f.toLowerCase())) ? 1 : 0);
  });

  // Construction status
  features.push(property.constructionStatus === "Ready to Move" ? 1 : 0);

  return features;
}

export function getRecommendations(targetProperty, allProperties, listingMode = 'buy', count = 3) {
  if (!targetProperty || allProperties.length < 2) return [];

  // Filter properties that match listing mode
  const pool = allProperties.filter(p => {
    if (p.id === targetProperty.id) return false;
    if (listingMode === 'rent') return p.listingType === 'rent' || p.listingType === 'both';
    if (listingMode === 'buy') return p.listingType === 'buy' || p.listingType === 'both';
    return true;
  });

  const targetVec = buildFeatureVector(targetProperty, allProperties, listingMode);

  const scored = pool.map(p => ({
    property: p,
    score: cosineSimilarity(targetVec, buildFeatureVector(p, allProperties, listingMode))
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map(s => s.property);
}

export function getSimilarByLocation(targetProperty, allProperties, count = 2) {
  return allProperties
    .filter(p => p.id !== targetProperty.id && p.location === targetProperty.location)
    .slice(0, count);
}

export function getTrendingProperties(allProperties, listingMode = 'buy', count = 6) {
  const pool = allProperties.filter(p => {
    if (listingMode === 'rent') return p.listingType === 'rent' || p.listingType === 'both';
    if (listingMode === 'buy') return p.listingType === 'buy' || p.listingType === 'both';
    return true;
  });
  return [...pool].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, count);
}
