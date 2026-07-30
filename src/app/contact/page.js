import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
            <PageHero tag="📬 Get In Touch" title="Contact Us & Get Your" titleAccent="Free Practice Audit" description="Our billing specialists will analyze your current billing and show you exactly how much revenue you could recover — no commitment, no sales pressure." />
            <section className="section">
                <div className="container">
                    <div className="contact-layout">
                        <div className="contact-info">
                            <h2>Let&apos;s Talk About Your Practice</h2>
                            <p>Whether you&apos;re looking for a full billing takeover, specific RCM services, or just a second opinion on your current billing — we&apos;re here to help.</p>
                            <div className="cinfo-card"><div className="cinfo-ico">📞</div><div><div className="cinfo-label">Phone</div><div className="cinfo-val">(513) 966-2259</div><div className="cinfo-note">Mon–Fri 8am–7pm EST · Sat 9am–3pm EST</div></div></div>
                            <div className="cinfo-card"><div className="cinfo-ico">✉</div><div><div className="cinfo-label">Email</div><div className="cinfo-val">info@renoxmed.com</div><div className="cinfo-note">Response promptly</div></div></div>
                            <div className="cinfo-card"><div className="cinfo-ico">📍</div><div><div className="cinfo-label">Office</div><div className="cinfo-val">9435 WATERSTONE BLVD STE 140-300 CINCINNATI, OH 45249</div></div></div>
                            <div className="cinfo-card"><div className="cinfo-ico">💬</div><div><div className="cinfo-label">Live Chat</div><div className="cinfo-val">Available on this site</div><div className="cinfo-note">Average response: quickly</div></div></div>
                            <div className="contact-steps">
                                <h4>What happens after you submit?</h4>
                                <div className="cstep"><div className="cstep-num">1</div><div className="cstep-text"><strong>Promptly</strong><span>A billing specialist contacts you to confirm your request</span></div></div>
                                <div className="cstep"><div className="cstep-num">2</div><div className="cstep-text"><strong>Quickly</strong><span>We complete your billing audit and prepare findings</span></div></div>
                                <div className="cstep"><div className="cstep-num">3</div><div className="cstep-text"><strong>A detailed review call</strong><span>Walk through results together — zero pressure</span></div></div>
                            </div>
                        </div>
                        <ContactForm
                            title="Request Your Free Practice Audit"
                            subtitle="Fill out below — we'll respond promptly"
                            submitButtonText="Submit Free Audit Request →"
                            recipientEmail="dumbo.taaha@gmail.com"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
