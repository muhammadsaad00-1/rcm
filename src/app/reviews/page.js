import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';

const reviews = [
    { text: '"RenoxMed dropped our denial rate from 14% to under 2% in just 60 days. We recovered over $180,000 in revenue we didn\'t know we were losing."', name: 'Dr. Rachel Torres, MD', role: 'Cardiology Associates · Dallas, TX', init: 'RT', bg: 'linear-gradient(135deg,#0B1437,#162257)' },
    { text: '"Our AR days dropped from 58 to 19 within the first quarter. The specialty coding expertise is exactly what a 3-location orthopedic group needs."', name: 'James Kowalski', role: 'Admin Director · Summit Orthopedics · IL', init: 'JK', bg: 'linear-gradient(135deg,#00C9A7,#0B1437)' },
    { text: '"Zero telehealth claim denials in 9 months. They stay ahead of every payer-specific rule change before it impacts our collections."', name: 'Dr. Anita Patel, LCSW', role: 'ClearMind Behavioral Health · CA', init: 'AP', bg: 'linear-gradient(135deg,#F5A623,#C17D00)' },
    { text: '"The transition took 11 days and we didn\'t miss a single claim. Our collections increased 24% in the first 6 months."', name: 'Dr. Michael Brown', role: 'Family Practice · Atlanta, GA', init: 'MB', bg: 'linear-gradient(135deg,#27AE60,#1A7040)' },
    { text: '"As a nephrology practice with complex dialysis billing, RenoxMed\'s specialty expertise is unmatched. They know every ESRD billing nuance."', name: 'Dr. Sarah Kim, MD', role: 'Chicago Kidney Center · Chicago, IL', init: 'SK', bg: 'linear-gradient(135deg,#E8534B,#9B2020)' },
    { text: '"The real-time dashboard is a game changer. I can see every claim status, denial, and payment from my phone. Total transparency."', name: 'Thomas Walsh, MBA', role: 'Practice Administrator · Midwest Urgent Care', init: 'TW', bg: 'linear-gradient(135deg,#0B1437,#162257)' },
    { text: '"We switched from a big-name billing company and immediately saw a 31% jump in collections. RenoxMed actually cares about your revenue."', name: 'Dr. Lisa Chen, DPM', role: 'Metro Podiatry Group · New York, NY', init: 'LC', bg: 'linear-gradient(135deg,#9B59B6,#6C3483)' },
    { text: '"Their credentialing team got us enrolled with 12 new payers in under 60 days. Not a single application was rejected."', name: 'Amanda Rodriguez, MBA', role: 'Desert Dermatology · Phoenix, AZ', init: 'AR', bg: 'linear-gradient(135deg,#2980B9,#1A5276)' },
    { text: '"Before RenoxMed, we had $340K sitting in unpaid claims over 90 days. Within 4 months, they recovered 87% of it."', name: 'Dr. David Park, MD', role: 'Pacific Neurology · San Diego, CA', init: 'DP', bg: 'linear-gradient(135deg,#00C9A7,#162257)' },
];

export default function ReviewsPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Client Reviews' }]} />
            <PageHero tag="⭐ Reviews" title="What Our Clients" titleAccent="Say About Us" description="1,200+ providers trust RenoxMed with their revenue cycle. Share your experience or read what others have to say." />

            {/* Leave a Review Form — ON TOP */}
            <section className="section" style={{ background: 'linear-gradient(180deg, var(--teal-soft) 0%, var(--off) 100%)' }}>
                <div className="container">
                    <div className="grid-2 grid-align" style={{ gap: 60 }}>
                        <div>
                            <div className="sec-label">Share Your Experience</div>
                            <h2 className="sec-title">Leave a Review</h2>
                            <p className="sec-sub" style={{ marginBottom: 28 }}>Your feedback helps other healthcare providers make informed decisions and helps us continue improving our services.</p>
                            <div className="feature-row"><div className="feature-icon">🏆</div><div className="feature-text"><h4>Your Voice Matters</h4><p>We value honest feedback from every practice we work with.</p></div></div>
                            <div className="feature-row"><div className="feature-icon">🔒</div><div className="feature-text"><h4>Verified Reviews Only</h4><p>All reviews are verified to ensure authenticity and trust.</p></div></div>
                            <div className="feature-row"><div className="feature-icon">⭐</div><div className="feature-text"><h4>Help the Community</h4><p>Your review helps other providers find the right billing partner.</p></div></div>
                        </div>
                        <div className="cform-wrap">
                            <div className="cform-title">Submit Your Review</div>
                            <div className="cform-sub">All fields marked * are required</div>
                            <div className="form-row"><div className="form-group"><label>Your Name *</label><input type="text" placeholder="Dr. Jane Smith" /></div><div className="form-group"><label>Your Title / Role *</label><input type="text" placeholder="Practice Owner, Admin Director..." /></div></div>
                            <div className="form-group"><label>Practice Name *</label><input type="text" placeholder="Your Practice Name" /></div>
                            <div className="form-group"><label>Specialty</label><select><option>Select Specialty</option><option>Cardiology</option><option>Orthopedics</option><option>Family Practice</option><option>Internal Medicine</option><option>Pediatrics</option><option>Neurology</option><option>Nephrology</option><option>Urgent Care</option><option>Other</option></select></div>
                            <div className="form-group"><label>Rating *</label>
                                <div style={{ display: 'flex', gap: 6, fontSize: 28, color: 'var(--gold)', cursor: 'pointer' }}>
                                    {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                                </div>
                            </div>
                            <div className="form-group"><label>Your Review *</label><textarea placeholder="Tell us about your experience with RenoxMed..." style={{ minHeight: 120 }}></textarea></div>
                            <button className="form-submit" type="button">Submit Review →</button>
                            <p className="form-note">Your review will be verified before publishing</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* All Reviews Below */}
            <section className="section" style={{ background: 'var(--off)' }}><div className="container">
                <div className="center" style={{ marginBottom: 40 }}>
                    <div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>Verified Reviews</div>
                    <h2 className="sec-title">What Healthcare Providers Are Saying</h2>
                </div>
                <div className="testi-grid">
                    {reviews.map((r, i) => (
                        <div key={i} className="testi-card">
                            <div className="testi-stars">★★★★★</div>
                            <p className="testi-text">{r.text}</p>
                            <div className="testi-author"><div className="testi-av" style={{ background: r.bg }}>{r.init}</div><div><div className="testi-name">{r.name}</div><div className="testi-role">{r.role}</div></div></div>
                        </div>
                    ))}
                </div>
            </div></section>
            <MiniFooter />
        </>
    );
}
