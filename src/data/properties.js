// Lucknow Real Estate Dataset - Parsed from items_data CSV
// Augmented with synthetic rent prices and listing types for dual rent/buy functionality

export const LUCKNOW_LOCALITIES = [
  "Jankipuram Extension", "Sector 1", "Raebareli Road", "Gomti Nagar",
  "Mahanagar", "Raitha", "Keshav Nagar 2", "Aminabad", "Narahi Bazar",
  "Pawanpuri", "Takrohi Market", "Manas Nagar Colony", "Charbagh",
  "Amar Shaheed Path", "Vrindavan Colony", "Sushant Golf City", "Kanpur Road"
];

export const PROPERTY_TYPES = [
  "Builder Floor", "Duplex Builder Floor", "Flat/Apartment", "Independent House"
];

export const AMENITIES_LIST = [
  "Lift", "Gated Society", "Parking", "Swimming Pool", "CCTV Surveillance",
  "Power Back-up", "Security Guard", "Vaastu Compliant", "Gymnasium",
  "Private Garden", "Roof Rights", "Piped-gas", "Visitor Parking"
];

// Property images from Unsplash (real estate themed)
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80",
  "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&q=80",
  "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=600&q=80",
];

const SAMPLE_OWNERS = [
  'neha',
  'aman',
  'ravi',
  'prachi',
  'ankush',
  'simran',
  'sameer',
  'kriti'
];

function parsePriceDisplay(pd) {
  if (!pd) return null;
  pd = pd.trim();
  if (pd.includes("Crore")) {
    const m = pd.match(/([\d.]+)\s*Crore/);
    if (m) return Math.round(parseFloat(m[1]) * 10000000);
  }
  if (pd.includes("Lac")) {
    const m = pd.match(/([\d.]+)\s*Lac/);
    if (m) return Math.round(parseFloat(m[1]) * 100000);
  }
  return null;
}

function extractArea(areaStr) {
  if (!areaStr) return null;
  const m = areaStr.match(/([\d,]+)\s*Sq/i);
  if (m) return parseInt(m[1].replace(/,/g, ""));
  return null;
}

function extractBedrooms(bedroomStr) {
  if (!bedroomStr) return null;
  const m = bedroomStr.match(/(\d+)/);
  return m ? parseInt(m[1]) : null;
}

// Parsed from CSV with corrected column mapping
const RAW_DATA = [
  { description: "", bedroom: "", builder_name: "3", google_map: "", page_link: "https://www.99acres.com/3-bhk-bedroom-apartment-flat-for-sale-in-dps-meridian-heights-sushant-golf-city-lucknow-1394-sq-ft-to-1916-sq-ft-npspid-F86501032", location: "Sushant Golf City", name: "3 BHK Flat in Sushant Golf City, Lucknow", agent_name: "Raj Sharma", phone: "08853110001", price_display: "Rs68 Lac", property_type: "Flat/Apartment", facilities: "Lift, Swimming Pool, Gated Society, Power Back-up, CCTV Surveillance" },
  { description: "", bedroom: "2 BHK", builder_name: "", google_map: "", page_link: "https://www.99acres.com/2-bhk-bedroom-apartment-flat-for-sale-in-krishna-tower-kanpur-road-lucknow-1184-sq-ft-to-1345-sq-ft-npspid-Y89606310", location: "Kanpur Road", name: "2 BHK Flat in Kanpur Road, Lucknow", agent_name: "Priya Mehta", phone: "09140480059", price_display: "Rs45 Lac", property_type: "Flat/Apartment", facilities: "Lift, Gated Society, Parking, Power Back-up" },
  { description: "935 Sq. Ft. - Buy 2 BHK / Bedroom Builder floor in ORO ELEMENTS, Jankipuram Extension, Lucknow. Resale property. Possession: Immediate. Ownership: Freehold. 7th floor (out of 12).", bedroom: "2 BHK", builder_name: "", floor_area: "934 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.9389741,80.963395", page_link: "https://www.99acres.com/2-bhk-bedroom-independent-builder-floor-for-sale-in-oro-elements-jankipuram-extension-lucknow-935-sq-ft-r1-spid-X86517344", location: "Jankipuram Extension", name: "2 BHK Builder Floor in Jankipuram Extension, Lucknow", agent_name: "Darshan", phone: "07234006604", possession: "Immediate", price_display: "Rs55.99 Lac", property_type: "Builder Floor", facilities: "Lift, Roof Rights, Gated Society, Newly Constructed, Overlooking Park, Overlooking Main Road, Private Garden, Vaastu Compliant, Visitor Parking, CCTV Surveillance, Swimming Pool, Power Back-up, Security / Fire Alarm" },
  { description: "1200 Sq. Ft. - Buy 3 BHK / Bedroom Builder floor in J R Complex, Sector 1, Lucknow. Resale property. Possession: Immediate. Ownership: Freehold. 1st floor (out of 3).", bedroom: "3 BHK", builder_name: "", floor_area: "1200 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.842166,81.022518", page_link: "https://www.99acres.com/3-bhk-bedroom-independent-builder-floor-for-sale-in-j-r-complex-lucknow-1200-sq-ft-spid-Y89366647", location: "Sector 1", name: "3 BHK Builder Floor in Sector 1, Lucknow", agent_name: "Manoj O", phone: "05224960092", possession: "Immediate", price_display: "Rs35 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "1690 Sq. Ft. - Buy 3 BHK Builder floor in Omaxe Metro City Lucknow, Raebareli Road. Resale. Ground floor.", bedroom: "3 BHK", builder_name: "Gaurav Kumar Mishra", floor_area: "1690 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.722986,80.95387", page_link: "https://www.99acres.com/3-bhk-bedroom-independent-builder-floor-for-sale-in-omaxe-metro-city-lucknow-raebareli-road-lucknow-1690-sq-ft-r10-spid-T68597910", location: "Raebareli Road", name: "3 BHK Builder Floor in Raebareli Road, Lucknow", agent_name: "Gaurav Kumar Mishra", phone: "06306986284", possession: "Immediate", price_display: "Rs1 Crore", property_type: "Builder Floor", facilities: "Vaastu Compliant, Visitor Parking, Security Guard, Separate entry for servant room, Piped-gas, Swimming Pool, Lift(s), 2 Covered Parking" },
  { description: "1600 Sq. Ft. - Buy 4 BHK Builder floor in Omaxe Metro City Lucknow, Raebareli Road. Resale. 1st floor.", bedroom: "4 BHK", builder_name: "Gaurav Kumar Mishra", floor_area: "1600 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.722986,80.95387", page_link: "https://www.99acres.com/4-bhk-bedroom-independent-builder-floor-for-sale-in-omaxe-metro-city-lucknow-raebareli-road-lucknow-1600-sq-ft-r3-spid-P82796534", location: "Raebareli Road", name: "4 BHK Builder Floor in Raebareli Road, Lucknow", agent_name: "Gaurav Kumar Mishra", phone: "06306986284", possession: "Immediate", price_display: "Rs1.1 Crore", property_type: "Builder Floor", facilities: "Separate entry for servant room, Vaastu Compliant, Visitor Parking, Granite Flooring, Security Guard, Piped-gas, Swimming Pool, 1 Covered Parking, 1 Open Parking, Power Back-up" },
  { description: "900 Sq. Ft. - Buy 2 BHK Builder floor in Omaxe Metro City Lucknow, Raebareli Road. Resale. 1st floor.", bedroom: "2 BHK", builder_name: "Gaurav Kumar Mishra", floor_area: "900 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.2269165,81.2336333", page_link: "https://www.99acres.com/2-bhk-bedroom-independent-builder-floor-for-sale-in-omaxe-metro-city-lucknow-raebareli-road-lucknow-900-sq-ft-r11-spid-W60217154", location: "Raebareli Road", name: "2 BHK Builder Floor in Raebareli Road, Lucknow", agent_name: "Gaurav Kumar Mishra", phone: "06306986284", possession: "Immediate", price_display: "Rs50 Lac", property_type: "Builder Floor", facilities: "Vaastu Compliant, Close to School, Vitrified Flooring, 1 Covered Parking, Power Back-up" },
  { description: "330 Sq. Ft. - Buy 1 BHK Builder floor in Gomti Nagar, Lucknow. Resale. 3rd floor.", bedroom: "1 BHK", builder_name: "", floor_area: "330 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.84651,80.94668", page_link: "https://www.99acres.com/1-bhk-bedroom-independent-builder-floor-for-sale-in-gomti-nagar-lucknow-330-sq-ft-r1-spid-T80520825", location: "Gomti Nagar", name: "1 BHK Builder Floor in Gomti Nagar, Lucknow", agent_name: "Abhishek Kumar Singh", phone: "08948745229", possession: "Immediate", price_display: "Rs15 Lac", property_type: "Builder Floor", facilities: "Corner Property, Overlooking Main Road, 1 Open Parking" },
  { description: "1600 Sq. Ft. - Buy 3 BHK Builder floor in Mahanagar, Lucknow. Resale. 3rd floor.", bedroom: "3 BHK", builder_name: "", floor_area: "1600 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.88043,80.95679", page_link: "https://www.99acres.com/3-bhk-bedroom-independent-builder-floor-for-sale-in-mahanagar-lucknow-1600-sq-ft-spid-L89776614", location: "Mahanagar", name: "3 BHK Builder Floor in Mahanagar, Lucknow", agent_name: "Arvind", phone: "09936650568", possession: "Dec 2026", price_display: "Rs3 Crore", property_type: "Builder Floor", facilities: "" },
  { description: "5400 Sq. Ft. - Buy 2 BHK Builder floor in Raitha, Lucknow. Resale. Basement floor.", bedroom: "2 BHK", builder_name: "", floor_area: "5400 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.989679750264,80.847793440929", page_link: "https://www.99acres.com/2-bhk-bedroom-independent-builder-floor-for-sale-in-raitha-lucknow-5400-sq-ft-spid-W89539214", location: "Raitha", name: "2 BHK Builder Floor in Raitha, Lucknow", agent_name: "Aniket Singh", phone: "09876543210", possession: "Immediate", price_display: "Rs24 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "550 Sq. Ft. - Buy 2 BHK Builder floor in Keshav Nagar 2, Lucknow. Resale. Ownership: Freehold.", bedroom: "2 BHK", builder_name: "", floor_area: "550 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.9027694193007,80.9210984612402", page_link: "https://www.99acres.com/2-bhk-bedroom-independent-builder-floor-for-sale-in-keshav-nagar-2-lucknow-550-sq-ft-spid-W89428384", location: "Keshav Nagar 2", name: "2 BHK Builder Floor in Keshav Nagar 2, Lucknow", agent_name: "Shivansh Tiwari", phone: "09012345678", possession: "Immediate", price_display: "Rs24 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "600 Sq. Ft. - Buy 1 BHK Builder floor in Aminabad, Lucknow. Resale. 3rd floor.", bedroom: "1 BHK", builder_name: "", floor_area: "600 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.845209,80.927769", page_link: "https://www.99acres.com/1-bhk-bedroom-independent-builder-floor-for-sale-in-aminabad-lucknow-600-sq-ft-spid-R89315537", location: "Aminabad", name: "1 BHK Builder Floor in Aminabad, Lucknow", agent_name: "S K", phone: "05224007767", possession: "Immediate", price_display: "Rs25 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "500 Sq. Ft. - Buy 1 BHK Builder floor in Narahi Bazar, Lucknow. Resale. 3rd floor.", bedroom: "1 BHK", builder_name: "", floor_area: "500 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.8484842777538,80.9487669810638", page_link: "https://www.99acres.com/1-bhk-bedroom-independent-builder-floor-for-sale-in-narahi-bazar-lucknow-500-sq-ft-spid-V89292069", location: "Narahi Bazar", name: "1 BHK Builder Floor in Narahi Bazar, Lucknow", agent_name: "Rais Ahmad", phone: "09219263385", possession: "Immediate", price_display: "Rs20.85 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "1000 Sq. Ft. - Buy 2 BHK Builder floor in Pawanpuri, Lucknow. Resale. 4th floor.", bedroom: "2 BHK", builder_name: "", floor_area: "1000 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.8112773103304,80.9102159678993", page_link: "https://www.99acres.com/2-bhk-bedroom-independent-builder-floor-for-sale-in-pawanpuri-lucknow-1000-sq-ft-r1-spid-J83385976", location: "Pawanpuri", name: "2 BHK Builder Floor in Pawanpuri, Lucknow", agent_name: "Yogesh", phone: "09415460406", possession: "Immediate", price_display: "Rs30 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "900 Sq. Ft. - Buy 3 BHK Duplex Builder floor in Takrohi Market, Lucknow. Resale.", bedroom: "3 BHK", builder_name: "", floor_area: "900 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.8915427925751,81.0076618552531", page_link: "https://www.99acres.com/3-bhk-bedroom-independent-builder-floor-for-sale-in-takrohi-market-lucknow-900-sq-ft-spid-L89013926", location: "Takrohi Market", name: "3 BHK Duplex Builder Floor in Takrohi Market, Lucknow", agent_name: "Neha Agrawal", phone: "09519160376", possession: "Immediate", price_display: "Rs85 Lac", property_type: "Duplex Builder Floor", facilities: "" },
  { description: "8550 Sq. Ft. - Buy 2 BHK Builder floor in Manas Nagar Colony, Lucknow. Resale. 2nd floor.", bedroom: "2 BHK", builder_name: "", floor_area: "8550 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.8456005,80.9633843", page_link: "https://www.99acres.com/2-bhk-bedroom-independent-builder-floor-for-sale-in-manas-nagar-colony-lucknow-8550-sq-ft-spid-P88889228", location: "Manas Nagar Colony", name: "2 BHK Builder Floor in Manas Nagar Colony, Lucknow", agent_name: "Abhishek T", phone: "07522075842", possession: "Immediate", price_display: "Rs28 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "1100 Sq. Ft. - Buy 3 BHK Builder floor in Charbagh, Lucknow. Resale. 1st floor.", bedroom: "3 BHK", builder_name: "", floor_area: "1100 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.8330686,80.9125674", page_link: "https://www.99acres.com/3-bhk-bedroom-independent-builder-floor-for-sale-in-charbagh-lucknow-1100-sq-ft-r1-spid-G70791464", location: "Charbagh", name: "3 BHK Builder Floor in Charbagh, Lucknow", agent_name: "Ravindra Singh", phone: "05222635670", possession: "Immediate", price_display: "Rs60 Lac", property_type: "Builder Floor", facilities: "" },
  { description: "1836 Sq. Ft. - Buy 3 BHK Builder floor in Unitech South City Gardens, Amar Shaheed Path, Lucknow. Resale. 1st floor.", bedroom: "3 BHK", builder_name: "", floor_area: "1836 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.767683,80.939713", page_link: "https://www.99acres.com/3-bhk-bedroom-independent-builder-floor-for-sale-in-unitech-south-city-gardens-amar-shaheed-path-lucknow-1836-sq-ft-spid-D88706230", location: "Amar Shaheed Path", name: "3 BHK Builder Floor in Amar Shaheed Path, Lucknow", agent_name: "Arun Srivastava", phone: "08853934115", possession: "Immediate", price_display: "Rs1.25 Crore", property_type: "Builder Floor", facilities: "" },
  { description: "9315 Sq. Ft. - Buy 9 BHK Duplex Builder floor in Charbagh, Lucknow. Resale.", bedroom: "9 BHK", builder_name: "", floor_area: "9000 Sq.Ft.", google_map: "https://www.google.com/maps?q=80.94668,26.84651", page_link: "https://www.99acres.com/9-bhk-bedroom-independent-builder-floor-for-sale-in-charbagh-lucknow-9315-sq-ft-spid-I88662798", location: "Charbagh", name: "9 BHK Duplex Builder Floor in Charbagh, Lucknow", agent_name: "Gaurav Narula", phone: "09876501234", possession: "Immediate", price_display: "Rs1.7 Crore", property_type: "Duplex Builder Floor", facilities: "" },
  { description: "1105 Sq. Ft. - Buy 2 BHK Builder floor in Vrindavan Colony, Lucknow. 1st floor.", bedroom: "2 BHK", builder_name: "", floor_area: "1105 Sq.Ft.", google_map: "https://www.google.com/maps?q=26.763033333333333,80.95280555555556", page_link: "https://www.99acres.com/2-bhk-bedroom-independent-builder-floor-for-sale-in-vrindavan-colony-lucknow-1105-sq-ft-spid-J88548018", location: "Vrindavan Colony", name: "2 BHK Builder Floor in Vrindavan Colony, Lucknow", agent_name: "Ravi Prakash Srivastava", phone: "05224071955", possession: "", price_display: "Rs58 Lac", property_type: "Builder Floor", facilities: "" },
];

// Generate a monthly rent from sale price (typically 0.3-0.5% of sale price per month)
function generateRent(salePrice) {
  if (!salePrice) return null;
  const rentRatio = 0.003 + Math.random() * 0.002;
  return Math.round((salePrice * rentRatio) / 500) * 500;
}

function formatPrice(num) {
  if (!num) return null;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
  return `₹${num.toLocaleString('en-IN')}`;
}

export const properties = RAW_DATA.map((p, i) => {
  const salePrice = parsePriceDisplay(p.price_display);
  const rent = generateRent(salePrice);
  const area = extractArea(p.floor_area);
  const bedrooms = extractBedrooms(p.bedroom || p.builder_name);
  
  // Assign listing type: alternating to have both rent and buy options
  const listingType = i % 3 === 0 ? 'both' : i % 3 === 1 ? 'buy' : 'rent';
  
  const facilitiesArr = p.facilities
    ? p.facilities.split(',').map(f => f.trim()).filter(f => f && !f.startsWith('feedback'))
    : [];

  return {
    id: i + 1,
    name: p.name,
    location: p.location || "Lucknow",
    fullAddress: p.name.includes('Lucknow') ? p.name : `${p.name}, Lucknow, U.P.`,
    description: p.description || `Beautifully maintained ${p.bedroom || ''} property in ${p.location}, Lucknow. Well-connected to major landmarks with easy access to schools, hospitals, and markets.`,
    bedrooms: bedrooms,
    bedroomLabel: p.bedroom || (bedrooms ? `${bedrooms} BHK` : ""),
    area: area,
    areaLabel: p.floor_area || (area ? `${area} Sq.Ft.` : ""),
    propertyType: p.property_type || "Builder Floor",
    salePrice: salePrice,
    salePriceDisplay: salePrice ? formatPrice(salePrice) : p.price_display,
    rentPrice: rent,
    rentPriceDisplay: rent ? `₹${rent.toLocaleString('en-IN')}/month` : null,
    listingType,
    possession: p.possession || "Immediate",
    agentName: p.agent_name || "Agent",
    phone: p.phone || "",
    googleMapLink: p.google_map || "",
    facilities: facilitiesArr,
    image: PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
    isFeatured: i < 4,
    isNew: i % 5 === 0,
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    constructionStatus: p.possession === "Immediate" ? "Ready to Move" : p.possession ? "Under Construction" : "Ready to Move",
    postedBy: SAMPLE_OWNERS[i % SAMPLE_OWNERS.length],
    furnishing: ["Furnished", "Semifurnished", "Unfurnished"][i % 3],
  };
});

export default properties;
