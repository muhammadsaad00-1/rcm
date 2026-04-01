'use client';
import { useState } from 'react';

/**
 * Reusable ContactForm component
 * Usage: <ContactForm title="Request Your Free Audit" />
 * 
 * Props:
 *  - title: Form heading
 *  - subtitle: Form description (optional)
 *  - includeSpecialty: Show specialty dropdown (default: true)
 *  - includeEHR: Show EHR system dropdown (default: true)
 *  - submitButtonText: Button label (default: "Submit Request →")
 *  - onSubmit: Callback when form submits (optional)
 *  - recipientEmail: Email to receive submissions (default: ms01.saad@gmail.com)
 */
export default function ContactForm({
  title = 'Request Your Free Practice Audit',
  subtitle = 'Fill out below — we\'ll respond within 2 business hours',
  includeSpecialty = true,
  includeEHR = true,
  submitButtonText = 'Submit Free Audit Request →',
  onSubmit = null,
  recipientEmail = 'ms01.saad@gmail.com'
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    practiceName: '',
    email: '',
    phone: '',
    specialty: '',
    providers: '',
    ehr: '',
    challenge: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.practiceName) {
        throw new Error('Please fill in all required fields');
      }

      // Call onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Submit via SnapItForms
        const formDataPayload = {
            access_key: "sf_623dc666dc0a8d6676c7e08635af7159",
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            message: `Practice Name: ${formData.practiceName}\nPhone: ${formData.phone}\nSpecialty: ${formData.specialty || 'N/A'}\nProviders: ${formData.providers || 'N/A'}\nEHR: ${formData.ehr || 'N/A'}\nChallenge: ${formData.challenge || 'N/A'}`,
            ...formData // Passing the rest for completeness if their backend stores arbitrary json
        };

        const res = await fetch('https://api.snapitforms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataPayload)
        });

        const data = await res.json();
        
        if (data.success) {
            console.log('Form submitted successfully!');
            console.log('Usage:', data.usage);
            console.log('Remaining submissions:', data.usage?.remaining);
        } else {
            console.error('Error:', data.error);
            if (data.error === 'Usage limit exceeded') {
                alert('You have reached your monthly submission limit. Please upgrade your plan.');
            }
            throw new Error(data.error || 'Submission failed securely via SnapItForms.');
        }
      }

      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        practiceName: '',
        email: '',
        phone: '',
        specialty: '',
        providers: '',
        ehr: '',
        challenge: ''
      });

      // Auto-reset after 4 seconds
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="cform-wrap">
        <div style={{
          background: 'rgba(40, 200, 64, 0.1)',
          border: '1px solid rgba(40, 200, 64, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
          <h3 style={{ color: '#28C840', marginBottom: '8px' }}>Request Submitted!</h3>
          <p style={{ color: 'var(--slate)' }}>
            A billing specialist will contact you within 2 business hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cform-wrap">
      <div className="cform-title">{title}</div>
      {subtitle && <div className="cform-sub">{subtitle}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              placeholder="Dr. John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              placeholder="Smith"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Practice Name *</label>
          <input
            type="text"
            name="practiceName"
            placeholder="Smith Family Medicine"
            value={formData.practiceName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="john@yourpractice.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            placeholder="(555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {includeSpecialty && (
          <div className="form-row">
            <div className="form-group">
              <label>Specialty *</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required={includeSpecialty}
              >
                <option value="">Select Specialty</option>
                <option>Cardiology</option>
                <option>Orthopedics</option>
                <option>Family Practice</option>
                <option>Internal Medicine</option>
                <option>Pediatrics</option>
                <option>Neurology</option>
                <option>Behavioral Health</option>
                <option>Urgent Care</option>
                <option>Nephrology</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>No. of Providers</label>
              <select
                name="providers"
                value={formData.providers}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Solo (1 provider)</option>
                <option>Small (2–5)</option>
                <option>Medium (6–15)</option>
                <option>Large (15+)</option>
              </select>
            </div>
          </div>
        )}

        {includeEHR && (
          <div className="form-group">
            <label>Current EHR / PM System</label>
            <select
              name="ehr"
              value={formData.ehr}
              onChange={handleChange}
            >
              <option value="">Select System</option>
              <option>Epic</option>
              <option>Athenahealth</option>
              <option>eClinicalWorks</option>
              <option>NextGen</option>
              <option>Kareo / Tebra</option>
              <option>DrChrono</option>
              <option>Practice Fusion</option>
              <option>Other</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>What is your biggest billing challenge?</label>
          <textarea
            name="challenge"
            placeholder="e.g. High denial rates, slow collections, credentialing delays, staff turnover..."
            value={formData.challenge}
            onChange={handleChange}
          ></textarea>
        </div>

        {error && (
          <div style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          className="form-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : submitButtonText}
        </button>

        <p className="form-note">🔒 HIPAA Protected · Signed BAA available · We never share your data</p>
      </form>
    </div>
  );
}
