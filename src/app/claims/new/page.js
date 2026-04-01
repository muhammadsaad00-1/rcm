'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewClaimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [services, setServices] = useState([]);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_insurance_id: '',
    service_date: '',
    service_location: '',
    diagnosis_codes: '',
    referring_provider: '',
    rendering_provider: '',
    total_charge: '0.00',
    notes: ''
  });

  const [lineItems, setLineItems] = useState([
    { cpt_code: '', description: '', quantity: 1, unit_charge: '0.00' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    
    // Fetch patients
    const { data: patientsData } = await supabase
      .from('patients')
      .select('id, first_name, last_name')
      .eq('is_active', true)
      .order('last_name');
    
    setPatients(patientsData || []);

    // Fetch service catalog
    const { data: servicesData } = await supabase
      .from('service_catalog')
      .select('*')
      .eq('is_active', true)
      .order('cpt_code');
    
    setServices(servicesData || []);
  };

  const fetchPatientInsurance = async (patientId) => {
    if (!patientId) {
      setInsurances([]);
      return;
    }

    const supabase = createClient();
    const { data } = await supabase
      .from('patient_insurance')
      .select('*, insurance_companies(company_name)')
      .eq('patient_id', patientId)
      .eq('is_active', true);
    
    setInsurances(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to create claims');
      setLoading(false);
      return;
    }

    // Parse diagnosis codes (comma-separated)
    const diagnosisCodes = formData.diagnosis_codes
      .split(',')
      .map(code => code.trim())
      .filter(code => code.length > 0);

    // Insert claim
    const { data: claimData, error: claimError } = await supabase
      .from('claims')
      .insert({
        patient_id: formData.patient_id,
        patient_insurance_id: formData.patient_insurance_id || null,
        service_date: formData.service_date,
        service_location: formData.service_location,
        diagnosis_codes: diagnosisCodes,
        referring_provider: formData.referring_provider,
        rendering_provider: formData.rendering_provider,
        total_charge: formData.total_charge,
        notes: formData.notes,
        status: 'draft',
        submitted_by: user.id
      })
      .select()
      .single();

    if (claimError) {
      setError(claimError.message);
      setLoading(false);
      return;
    }

    // Insert line items
    const lineItemsToInsert = lineItems
      .filter(item => item.cpt_code && item.description)
      .map(item => ({
        claim_id: claimData.id,
        cpt_code: item.cpt_code,
        description: item.description,
        quantity: parseInt(item.quantity),
        unit_charge: parseFloat(item.unit_charge),
        total_charge: parseFloat(item.unit_charge) * parseInt(item.quantity)
      }));

    if (lineItemsToInsert.length > 0) {
      const { error: lineItemError } = await supabase
        .from('claim_line_items')
        .insert(lineItemsToInsert);

      if (lineItemError) {
        setError('Claim created but failed to add line items: ' + lineItemError.message);
        setLoading(false);
        return;
      }
    }

    // Redirect to claims list
    router.push('/claims');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'patient_id') {
      fetchPatientInsurance(value);
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...lineItems];
    newLineItems[index][field] = value;
    setLineItems(newLineItems);
    calculateTotal(newLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { cpt_code: '', description: '', quantity: 1, unit_charge: '0.00' }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      const newLineItems = lineItems.filter((_, i) => i !== index);
      setLineItems(newLineItems);
      calculateTotal(newLineItems);
    }
  };

  const selectService = (index, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      handleLineItemChange(index, 'cpt_code', service.cpt_code);
      handleLineItemChange(index, 'description', service.description);
      handleLineItemChange(index, 'unit_charge', service.standard_charge.toString());
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const lineTotal = parseFloat(item.unit_charge || 0) * parseInt(item.quantity || 0);
      return sum + lineTotal;
    }, 0);
    setFormData(prev => ({ ...prev, total_charge: total.toFixed(2) }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray1)', padding: '32px 5%' }}>
      <div className="modern-container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/claims" className="text-teal font-semibold text-sm hover-lift" style={{ textDecoration: 'none' }}>
            ← Back to Claim Pipeline
          </Link>
          <h1 className="text-navy font-bold" style={{ fontSize: '32px', marginTop: '16px', letterSpacing: '-0.02em' }}>
            Create New Claim
          </h1>
          <p className="text-gray text-sm" style={{ marginTop: '8px' }}>
            Submit a new insurance claim using verified ICD-10 and CPT codes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modern-grid">
          {error && (
            <div className="badge-modern danger" style={{ padding: '12px 16px', fontSize: '14px', borderRadius: '8px', display: 'flex', width: '100%' }}>
              <strong style={{ marginRight: '8px' }}>Error:</strong> {error}
            </div>
          )}

          {/* Patient & Insurance Info */}
          <div className="card-modern">
            <h2 className="card-header-modern text-navy font-semibold text-lg" style={{ borderBottom: 'none' }}>
              Patient & Insurance
            </h2>

            <div className="modern-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label className="label-modern">Patient *</label>
                <select
                  name="patient_id"
                  required
                  value={formData.patient_id}
                  onChange={handleChange}
                  className="input-modern"
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.last_name}, {patient.first_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-modern">Primary Insurance</label>
                <select
                  name="patient_insurance_id"
                  value={formData.patient_insurance_id}
                  onChange={handleChange}
                  className="input-modern"
                  disabled={!formData.patient_id}
                >
                  <option value="">Select Insurance</option>
                  {insurances.map(insurance => (
                    <option key={insurance.id} value={insurance.id}>
                      {insurance.insurance_companies?.company_name} - {insurance.policy_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="card-modern">
            <h2 className="card-header-modern text-navy font-semibold text-lg" style={{ borderBottom: 'none' }}>
              Encounter Information
            </h2>

            <div className="modern-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
              <div>
                <label className="label-modern">Service Date *</label>
                <input
                  type="date"
                  name="service_date"
                  required
                  value={formData.service_date}
                  onChange={handleChange}
                  className="input-modern"
                />
              </div>
              <div>
                <label className="label-modern">Service Location (POS) *</label>
                <input
                  type="text"
                  name="service_location"
                  required
                  value={formData.service_location}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="e.g. Office, Telehealth, Hospital"
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="label-modern">Diagnosis Codes (ICD-10) *</label>
              <input
                type="text"
                name="diagnosis_codes"
                required
                value={formData.diagnosis_codes}
                onChange={handleChange}
                className="input-modern"
                placeholder="E11.9, I10, Z79.4 (comma-separated)"
              />
              <p className="text-gray text-xs" style={{ marginTop: '8px' }}>
                Enter all valid ICD-10 diagnosis codes separated by commas.
              </p>
            </div>

            <div className="modern-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label className="label-modern">Referring Provider (NPI)</label>
                <input
                  type="text"
                  name="referring_provider"
                  value={formData.referring_provider}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="Dr. Smith (Optional)"
                />
              </div>
              <div>
                <label className="label-modern">Rendering Provider *</label>
                <input
                  type="text"
                  name="rendering_provider"
                  required
                  value={formData.rendering_provider}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="e.g. Dr. Johnson"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card-modern">
            <div className="card-header-modern">
              <h2 className="text-navy font-semibold text-lg">
                Procedures & Billed Services
              </h2>
              <button
                type="button"
                onClick={addLineItem}
                className="btn-modern btn-modern-outline"
                style={{ background: 'var(--white)' }}
              >
                + Add Line Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lineItems.map((item, index) => (
                <div key={index} style={{
                  padding: '24px',
                  background: 'var(--off)',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--gray2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span className="badge-modern neutral" style={{ background: 'white' }}>Service Line {index + 1}</span>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="text-red font-semibold text-sm hover-lift"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="modern-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr', marginBottom: '16px' }}>
                    <div>
                      <label className="label-modern">Service Template</label>
                      <select
                        value=""
                        onChange={(e) => selectService(index, e.target.value)}
                        className="input-modern"
                      >
                        <option value="">Select from catalog or enter manually</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.cpt_code} - {service.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-modern">CPT / HCPCS Code</label>
                      <input
                        type="text"
                        value={item.cpt_code}
                        onChange={(e) => handleLineItemChange(index, 'cpt_code', e.target.value)}
                        className="input-modern"
                        placeholder="e.g. 99213"
                      />
                    </div>
                    <div>
                      <label className="label-modern">Units / Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                        onBlur={() => calculateTotal(lineItems)}
                        className="input-modern"
                      />
                    </div>
                  </div>

                  <div className="modern-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    <div>
                      <label className="label-modern">Procedure Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        className="input-modern"
                        placeholder="e.g. Office visit, established patient"
                      />
                    </div>
                    <div>
                      <label className="label-modern">Unit Charge ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_charge}
                        onChange={(e) => handleLineItemChange(index, 'unit_charge', e.target.value)}
                        onBlur={() => calculateTotal(lineItems)}
                        className="input-modern"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', textAlign: 'right', fontWeight: '700', fontSize: '15px' }} className="text-teal">
                    Line Total: ${(parseFloat(item.unit_charge || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '24px', 
              borderTop: '2px solid var(--gray2)',
              marginTop: '32px'
            }}>
              <div>
                <p className="text-gray text-xs" style={{ textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em', textAlign: 'right' }}>Total Computed Billed Amount</p>
                <div className="text-navy" style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1' }}>
                  ${formData.total_charge}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card-modern">
            <h2 className="card-header-modern text-navy font-semibold text-lg" style={{ borderBottom: 'none' }}>
              Additional Claim Notes
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="input-modern"
              style={{ resize: 'vertical' }}
              placeholder="e.g. Any authorization codes, or narrative details for unlisted procedure..."
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Link href="/claims" className="btn-modern btn-modern-outline" style={{ background: 'var(--white)' }}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-modern btn-modern-primary"
              style={{ padding: '12px 32px' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round"/>
                  </svg>
                  Processing...
                </>
              ) : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .hover-lift {
          display: inline-block;
          transition: transform 0.2s;
        }
        .hover-lift:hover {
          transform: translateX(-4px); /* Because it's a back button usually */
        }
        
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
