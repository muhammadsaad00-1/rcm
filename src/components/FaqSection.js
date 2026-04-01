'use client';
import { useState } from 'react';

export default function FaqSection({ faqs }) {
    const [openIdx, setOpenIdx] = useState(-1);
    const toggle = (i) => setOpenIdx(openIdx === i ? -1 : i);
    return (
        <div>
            {faqs.map((faq, i) => (
                <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
                    <button className="faq-q" onClick={() => toggle(i)}>
                        {faq.q}
                        <span className="faq-icon">+</span>
                    </button>
                    <div className="faq-a">{faq.a}</div>
                </div>
            ))}
        </div>
    );
}
