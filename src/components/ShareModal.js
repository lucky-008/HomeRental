import React, { useState } from 'react';
import { shareProperty } from '../utils/api';

export default function ShareModal({ property, onClose, user }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientEmail.trim()) {
      setError('Please enter recipient email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await shareProperty(
        user.username,
        recipientEmail,
        property.id,
        property.name,
        message,
        'email'
      );
      setSuccess(true);
      setRecipientEmail('');
      setMessage('');
      if (window.dashboardRefresh) {
        window.dashboardRefresh();
      }
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.message || 'Failed to share property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">🔗 Share Property</h2>
          <button onClick={onClose} className="text-white text-2xl hover:opacity-80">✕</button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-green-700 font-semibold">Property shared successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Property: {property.name}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  rows="3"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Sharing...' : 'Share Property'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
