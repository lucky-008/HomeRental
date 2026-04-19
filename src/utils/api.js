
// Backend API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Register a new user
export async function register(username, password, email) {
	const res = await fetch(`${API_BASE}/auth/register`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
		body: JSON.stringify({ username, password, email })
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || 'Registration failed');
	}
	return res.json();
}

// Login user
export async function login(username, password) {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
		body: JSON.stringify({ username, password })
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || 'Login failed');
	}
	return res.json();
}

// Logout user
export async function logout() {
	const res = await fetch(`${API_BASE}/auth/logout`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (!res.ok) throw new Error('Logout failed');
	return res.json();
}

// Save a property for a user
export async function saveProperty(username, propertyId) {
	const res = await fetch(`${API_BASE}/saved/save`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
		body: JSON.stringify({ username, propertyId })
	});
	if (!res.ok) throw new Error('Failed to save property');
	return res.json();
}

// Unsave a property for a user
export async function unsaveProperty(username, propertyId) {
	const res = await fetch(`${API_BASE}/saved/unsave`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
		body: JSON.stringify({ username, propertyId })
	});
	if (!res.ok) throw new Error('Failed to unsave property');
	return res.json();
}

// Get saved properties for a user
export async function getSavedProperties(username) {
	const res = await fetch(`${API_BASE}/saved/saved/${username}?t=${Date.now()}`, {
		cache: 'no-store',
		headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (res.status === 304) return { savedProperties: [] };
	if (!res.ok) throw new Error('Failed to fetch saved properties');
	const data = await res.json();
	const savedProperties = Array.isArray(data.savedProperties)
		? data.savedProperties.map(id => String(id))
		: [];
	return { ...data, savedProperties };
}

// Send a message about a property
export async function sendMessage(from, to, propertyId, propertyName, message) {
	const res = await fetch(`${API_BASE}/messages/send`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
		body: JSON.stringify({ from, to, propertyId, propertyName, message })
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || 'Failed to send message');
	}
	return res.json();
}

// Get messages for a user
export async function getMessages(username) {
	const res = await fetch(`${API_BASE}/messages/inbox/${username}?t=${Date.now()}`, {
		cache: 'no-store',
		headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (res.status === 304) return { messages: [] };
	if (!res.ok) throw new Error('Failed to fetch messages');
	return res.json();
}

// Mark message as read
export async function markMessageRead(messageId) {
	const res = await fetch(`${API_BASE}/messages/read/${messageId}`, {
		method: 'PUT',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (!res.ok) throw new Error('Failed to update message');
	return res.json();
}

// Share a property
export async function shareProperty(from, to, propertyId, propertyName, message, platform) {
	const res = await fetch(`${API_BASE}/shares/share`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
		body: JSON.stringify({ from, to, propertyId, propertyName, message, platform })
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || 'Failed to share property');
	}
	return res.json();
}

// Get shares for a user
export async function getShares(username) {
	const res = await fetch(`${API_BASE}/shares/shares/${username}?t=${Date.now()}`, {
		cache: 'no-store',
		headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (res.status === 304) return { shares: [] };
	if (!res.ok) throw new Error('Failed to fetch shares');
	return res.json();
}

// Create a listing
export async function createListing(username, listingData) {
	const res = await fetch(`${API_BASE}/listings/create`, {
		method: 'POST',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
		body: JSON.stringify({ username, ...listingData })
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || 'Failed to create listing');
	}
	return res.json();
}

// Get user's listings
export async function getUserListings(username) {
	const res = await fetch(`${API_BASE}/listings/user/${username}?t=${Date.now()}`, {
		cache: 'no-store',
		headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (res.status === 304) return { listings: [] };
	if (!res.ok) {
		console.error('Failed to fetch listings:', res.status, res.statusText);
		throw new Error('Failed to fetch listings');
	}
	return res.json();
}

// Get all listings
export async function getAllListings() {
	const res = await fetch(`${API_BASE}/listings?t=${Date.now()}`, {
		cache: 'no-store',
		headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (res.status === 304) return { listings: [] };
	if (!res.ok) throw new Error('Failed to fetch listings');
	return res.json();
}

// Get a single listing by ID
export async function getListing(listingId) {
	const res = await fetch(`${API_BASE}/listings/${listingId}?t=${Date.now()}`, {
		cache: 'no-store',
		headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.error || 'Failed to fetch listing');
	}
	return res.json();
}

// Delete a listing
export async function deleteListing(listingId) {
	const res = await fetch(`${API_BASE}/listings/${listingId}`, {
		method: 'DELETE',
		cache: 'no-store',
		headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
	});
	if (!res.ok) throw new Error('Failed to delete listing');
	return res.json();
}

