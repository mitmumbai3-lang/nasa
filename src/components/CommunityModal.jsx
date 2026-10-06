import React, { useState, useEffect } from "react";
import { X, Users, MapPin, Send, CheckCircle2, Heart, BookMarked } from "lucide-react";

export default function CommunityModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("connect");
  const [prayerText, setPrayerText] = useState("");
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const communities = [
    {
      name: "Cathedral of the Living Word",
      tradition: "Liturgical & Historical",
      location: "Central Historic District & Online Live-Stream",
      meetingTime: "Sundays 9:00 AM & 11:15 AM",
      desc: "Sacred liturgy, deep choral worship, and table communion centered on historic Christian orthodoxy.",
      tags: ["Historic", "Eucharistic", "All Ages"]
    },
    {
      name: "The Emmaus Road Fellowship",
      tradition: "Contemplative & Missional",
      location: "East Riverfront Arts Loft & Regional Home Hubs",
      meetingTime: "Thursdays 7:00 PM • Sundays 10:00 AM",
      desc: "Hospitality, shared meals, verse-by-verse scripture immersion, and neighborhood outreach.",
      tags: ["Home Groups", "Young Adults", "Hospitality"]
    },
    {
      name: "Grace & Truth Global Network",
      tradition: "Ecumenical & Digital",
      location: "International Digital Circles (Zoom & Discord)",
      meetingTime: "Daily Prayer Vigils & Weekly Global Roundtables",
      desc: "Connecting believers, seekers, and pilgrims worldwide across different time zones in daily prayer.",
      tags: ["Online", "Global", "Multilingual"]
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    if (!prayerText.trim()) return;
    setPrayerSubmitted(true);
    setTimeout(() => {
      setPrayerText("");
      setPrayerSubmitted(false);
    }, 4500);
  };

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tradition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-dialog-title"
    >
      <div
        className="fixed inset-0 bg-[#0D0C0B]/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 canvas-grain opacity-40 pointer-events-none" />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#C8A66A]/30 bg-[#161514] text-[#E7D8BB] shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#C8A66A]/20 bg-[#0D0C0B]/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#C8A66A]" />
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C8A66A]">
                The Living Body of Christ
              </span>
              <h3 id="community-dialog-title" className="font-serif text-xl text-[#FFF7E8]">
                Find Fellowship & Prayer
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-[#E7D8BB]/20 p-2 text-[#E7D8BB]/70 transition-colors hover:border-[#C8A66A] hover:bg-[#C8A66A]/10 hover:text-[#FFF]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E7D8BB]/10 bg-[#121110] px-6">
          <button
            onClick={() => setActiveTab("connect")}
            className={`border-b-2 px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors ${
              activeTab === "connect"
                ? "border-[#C8A66A] text-[#C8A66A]"
                : "border-transparent text-[#E7D8BB]/60 hover:text-[#E7D8BB]"
            }`}
          >
            Locate Fellowship
          </button>
          <button
            onClick={() => setActiveTab("prayer")}
            className={`border-b-2 px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors ${
              activeTab === "prayer"
                ? "border-[#C8A66A] text-[#C8A66A]"
                : "border-transparent text-[#E7D8BB]/60 hover:text-[#E7D8BB]"
            }`}
          >
            Submit Prayer Request
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`border-b-2 px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors ${
              activeTab === "guide"
                ? "border-[#C8A66A] text-[#C8A66A]"
                : "border-transparent text-[#E7D8BB]/60 hover:text-[#E7D8BB]"
            }`}
          >
            Small Group Study Guide
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === "connect" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-serif text-lg text-[#FFF]">Walking Together in Truth</h4>
                  <p className="text-xs text-[#E7D8BB]/70">
                    The faith was never meant to be walked in isolation. Discover communities anchored in Christ.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Filter by city, style, or online..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-[#C8A66A]/20 bg-[#0D0C0B] px-3 py-1.5 text-xs text-[#E7D8BB] placeholder-[#E7D8BB]/40 focus:border-[#C8A66A] focus:outline-none"
                />
              </div>

              <div className="grid gap-4">
                {filteredCommunities.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#C8A66A]/20 bg-[#0D0C0B]/50 p-5 transition-all hover:border-[#C8A66A]/50 hover:bg-[#0D0C0B]/80"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="font-serif text-base text-[#FFF]">{item.name}</h5>
                      <span className="rounded-full bg-[#C8A66A]/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[#C8A66A]">
                        {item.tradition}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#E7D8BB]/60">
                      <MapPin className="h-3.5 w-3.5 text-[#C8A66A]" />
                      <span>{item.location}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#E7D8BB]/80">
                      {item.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E7D8BB]/10 pt-3">
                      <div className="flex gap-1.5">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#E7D8BB]/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] text-[#C8A66A]">{item.meetingTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prayer" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center">
                <Heart className="mx-auto h-8 w-8 text-[#7B1E22]" />
                <h4 className="mt-3 font-serif text-2xl text-[#FFF]">Enter into the Sanctuary of Prayer</h4>
                <p className="mt-2 text-xs text-[#E7D8BB]/70">
                  “Cast all your anxiety on Him because He cares for you.” — 1 Peter 5:7
                </p>
              </div>

              {prayerSubmitted ? (
                <div className="rounded-xl border border-[#C8A66A]/40 bg-[#C8A66A]/10 p-6 text-center animate-fade-in">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[#C8A66A]" />
                  <h5 className="mt-3 font-serif text-lg text-[#FFF]">Your Petition Has Been Received</h5>
                  <p className="mt-2 text-xs text-[#E7D8BB]/80 leading-relaxed">
                    May the peace of Christ, which surpasses all understanding, guard your heart and mind.
                    Our pastoral prayer circle will intercede in confidence.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePrayerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C8A66A] mb-1.5">
                      Your Prayer Request or Word of Praise
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={prayerText}
                      onChange={(e) => setPrayerText(e.target.value)}
                      placeholder="Share what is upon your soul: a trial you are bearing, a loved one in need, or gratitude for God's mercy..."
                      className="w-full rounded-xl border border-[#C8A66A]/30 bg-[#0D0C0B] p-4 text-sm text-[#E7D8BB] placeholder-[#E7D8BB]/40 focus:border-[#C8A66A] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#E7D8BB]/50">
                      Requests are kept strictly confidential.
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-full bg-[#C8A66A] px-6 py-2.5 text-xs font-semibold text-[#0D0C0B] transition-transform hover:scale-105 active:scale-95"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Lift in Prayer</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "guide" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl text-[#FFF]">Six-Part Study Curriculum</h4>
                <p className="text-xs text-[#E7D8BB]/70">
                  A companion curriculum for churches, student ministries, and fireside circles.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { session: "Session 1", theme: "Genesis 1:1", title: "Light in Primal Chaos" },
                  { session: "Session 2", theme: "Genesis 15:5", title: "Counting the Impossible Stars" },
                  { session: "Session 3", theme: "Exodus 14:22", title: "The Walls of Water" },
                  { session: "Session 4", theme: "John 1:14", title: "The God Who Broke Bread" },
                  { session: "Session 5", theme: "Matthew 28:6", title: "The Morning of Real Hope" },
                  { session: "Session 6", theme: "Revelation 21:5", title: "The City With No Tears" },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-[#C8A66A]/20 bg-[#0D0C0B]/40 p-4"
                  >
                    <BookMarked className="h-5 w-5 text-[#C8A66A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C8A66A]">{s.session} • {s.theme}</span>
                      <h5 className="font-serif text-sm text-[#FFF]">{s.title}</h5>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#C8A66A]/30 bg-[#0D0C0B] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="font-serif text-base text-[#FFF]">Download Comprehensive Discussion Guide (PDF)</h5>
                  <p className="text-xs text-[#E7D8BB]/60">Includes leader notes, historical art background, and reflection sheets.</p>
                </div>
                <button
                  onClick={() => alert("Study guide downloaded! (Curriculum packet generated)")}
                  className="rounded-full bg-[#C8A66A] px-5 py-2 text-xs font-semibold text-[#0D0C0B] hover:bg-[#E4C58B] shrink-0"
                >
                  Download Guide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
