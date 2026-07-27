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
  subtitle = 'Fill out below — we\'ll be in touch shortly.',
  includeSpecialty = true,
  includeEHR = true,
  submitButtonText = 'Submit Free Audit Request →',
  onSubmit = null,
  recipientEmail = 'dumbo.taaha@gmail.com'
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
        // Use the native FormData API as provided
        const submitData = new FormData();
        submitData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "853dfd10-7eda-431a-86e3-78d0051d53da");
        submitData.append("subject", `New Practice Audit Request - ${formData.practiceName}`);
        submitData.append("from_name", `${formData.firstName} ${formData.lastName}`);
        submitData.append("name", `${formData.firstName} ${formData.lastName}`);
        submitData.append("email", formData.email);
        submitData.append("phone", formData.phone);
        submitData.append("practice_name", formData.practiceName);
        submitData.append("specialty", formData.specialty || "N/A");
        submitData.append("providers", formData.providers || "N/A");
        submitData.append("ehr", formData.ehr || "N/A");
        submitData.append("challenge", formData.challenge || "N/A");

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: submitData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error submitting form");
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
            A billing specialist will be in touch with you shortly.
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
