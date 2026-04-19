import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'buy' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-amber-900 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-400 rounded-full -translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">Get in <span className="text-amber-400">Touch</span></h1>
          <p className="text-gray-300 text-lg">We're here to help you find your perfect property in Lucknow</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">We'd Love to Hear From You</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Whether you're looking to buy, rent, or list your property in Lucknow, our team is ready to assist you every step of the way.
            </p>

            <div className="space-y-5">
              {[
                { icon: '📍', title: 'Visit Us', lines: ['Hazratganj, Lucknow', 'Uttar Pradesh - 226001'] },
                { icon: '📞', title: 'Call Us', lines: ['+91 800-555-6789', 'Mon–Sat, 9am–6pm'] },
                { icon: '✉️', title: 'Email Us', lines: ['hello@nestluck.in', 'support@nestluck.in'] },
              ].map(info => (
                <div key={info.title} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{info.title}</p>
                    {info.lines.map(l => <p key={l} className="text-sm text-gray-500">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours */}
            <div className="mt-6 bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h4 className="font-bold text-gray-900 mb-3">🕐 Office Hours</h4>
              <div className="space-y-1 text-sm">
                {[['Mon – Fri', '9:00 AM – 7:00 PM'], ['Saturday', '9:00 AM – 5:00 PM'], ['Sunday', 'Closed']].map(([day, time]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-500">{day}</span>
                    <span className="font-semibold text-gray-800">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">Our team will get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '', type: 'buy' }); }}
                  className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-gray-900 mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-xl p-1">
                    {[['buy', '🏠 Buying'], ['rent', '🔑 Renting'], ['sell', '💰 Selling'], ['other', '💬 Other']].map(([val, label]) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setForm(f => ({ ...f, type: val }))}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all ${form.type === val ? 'bg-amber-500 text-white shadow' : 'text-gray-600 hover:bg-white'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input
                        required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                      <input
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                    <textarea
                      required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={5}
                      placeholder="Tell us about the property you're looking for..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-amber-100 text-sm">
                    Send Message 📨
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
