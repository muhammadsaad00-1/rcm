'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  
  const [formData, setFormData] = useState({
    claim_id: '',
    payment_type: 'insurance',
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    check_number: '',
    reference_number: '',
    payer_name: '',
    notes: ''
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    const supabase = createClient();
    
    // Fetch claims that are submitted or pending (not draft or paid)
    const { data } = await supabase
      .from('claims')
      .select('*, patients!inner(first_name, last_name)')
      .in('status', ['submitted', 'pending', 'denied', 'appealed'])
      .order('service_date', { ascending: false });
    
    setClaims(data || []);
  };

  const handleClaimSelect = async (claimId) => {
    if (!claimId) {
      setSelectedClaim(null);
      return;
    }

    const claim = claims.find(c => c.id === claimId);
    setSelectedClaim(claim);

    // Fetch existing payments for this claim
    const supabase = createClient();
    const { data: payments } = await supabase
      .from('payments')
      .select('amount_paid')
      .eq('claim_id', claimId);

    const totalPaid = payments?.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0) || 0;
    const balance = parseFloat(claim.total_charge) - totalPaid;

    // Pre-fill with balance
    setFormData(prev => ({
      ...prev,
      claim_id: claimId,
      amount_paid: balance.toFixed(2)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to post payments');
      setLoading(false);
      return;
    }

    // Insert payment
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        claim_id: formData.claim_id || null,
        payment_type: formData.payment_type,
        amount_paid: parseFloat(formData.amount_paid),
        payment_date: formData.payment_date,
        check_number: formData.check_number || null,
        reference_number: formData.reference_number || null,
        payer_name: formData.payer_name || null,
        notes: formData.notes || null,
        posted_by: user.id
      });

    if (paymentError) {
      setError(paymentError.message);
      setLoading(false);
      return;
    }

    // Check if claim is now fully paid
    if (formData.claim_id) {
      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount_paid')
        .eq('claim_id', formData.claim_id);

      const totalPaid = allPayments?.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0) || 0;

      if (selectedClaim && totalPaid >= parseFloat(selectedClaim.total_charge)) {
        // Update claim status to paid
        await supabase
          .from('claims')
          .update({ 
            status: 'paid',
            paid_date: new Date().toISOString()
          })
          .eq('id', formData.claim_id);
      }
    }

    // Redirect to payments list
    router.push('/payments');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/payments" style={{ 
            color: '#667eea', 
            textDecoration: 'none', 
            fontSize: '14px', 
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ← Back to Payments
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginTop: '16px', color: '#1a202c' }}>
            Post Payment
          </h1>
          <p style={{ color: '#718096', marginTop: '8px' }}>
            Record a payment received from insurance or patient
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fed7d7',
              color: '#c53030',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Claim Selection */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#2d3748' }}>
              Select Claim
            </h2>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>
              Choose the claim this payment is for, or leave blank for general payment posting
            </p>

            <div>
              <label style={labelStyle}>Claim</label>
              <select
                name="claim_id"
                value={formData.claim_id}
                onChange={(e) => handleClaimSelect(e.target.value)}
                style={inputStyle}
              >
                <option value="">No specific claim (General Payment)</option>
                {claims.map(claim => (
                  <option key={claim.id} value={claim.id}>
                    {claim.claim_number} - {claim.patients?.first_name} {claim.patients?.last_name} - ${parseFloat(claim.total_charge).toFixed(2)} ({claim.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedClaim && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#f7fafc',
                borderRadius: '8px',
                borderLeft: '4px solid #667eea'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#718096' }}>Patient:</span>{' '}
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>
                      {selectedClaim.patients?.first_name} {selectedClaim.patients?.last_name}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#718096' }}>Service Date:</span>{' '}
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>
                      {new Date(selectedClaim.service_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#718096' }}>Total Charge:</span>{' '}
                    <span style={{ fontWeight: '700', color: '#2d3748', fontSize: '15px' }}>
                      ${parseFloat(selectedClaim.total_charge).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#718096' }}>Status:</span>{' '}
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: '#4299e1',
                      color: 'white'
                    }}>
                      {selectedClaim.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#2d3748' }}>
              Payment Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Payment Type *</label>
                <select
                  name="payment_type"
                  required
                  value={formData.payment_type}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="insurance">Insurance Payment</option>
                  <option value="patient">Patient Payment</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Payment Date *</label>
                <input
                  type="date"
                  name="payment_date"
                  required
                  value={formData.payment_date}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Amount Paid *</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#2d3748',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="amount_paid"
                  required
                  value={formData.amount_paid}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    paddingLeft: '36px',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Check Number</label>
                <input
                  type="text"
                  name="check_number"
                  value={formData.check_number}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="CHK-12345"
                />
              </div>
              <div>
                <label style={labelStyle}>Reference Number</label>
                <input
                  type="text"
                  name="reference_number"
                  value={formData.reference_number}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="REF-67890"
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Payer Name</label>
              <input
                type="text"
                name="payer_name"
                value={formData.payer_name}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Insurance Company or Patient Name"
              />
            </div>

            <div>
              <label style={labelStyle}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                style={{
                  ...inputStyle,
                  resize: 'vertical'
                }}
                placeholder="Additional payment details or notes..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 32px',
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Posting Payment...' : 'Post Payment'}
            </button>
            <Link href="/payments" style={{
              padding: '14px 32px',
              background: 'white',
              color: '#2d3748',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '500',
  color: '#2d3748',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none'
};
