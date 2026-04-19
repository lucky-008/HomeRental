import React, { useState } from 'react';
import { sendMessage } from '../utils/api';

export default function MessageModal({ property, onClose, user, owner }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a message');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendMessage(
        user.username,
        owner,
        property.id,
        property.name,
        message
      );
      setSuccess(true);
      setMessage('');
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send message');
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
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">💬 Send Message</h2>
          <button onClick={onClose} className="text-white text-2xl hover:opacity-80">✕</button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-green-700 font-semibold">Message sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Property: {property.name}</p>
                <p className="text-xs text-gray-500">To: {owner}</p>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                rows="5"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
