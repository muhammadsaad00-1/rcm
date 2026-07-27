'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PatientsClient({ patients, role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  function applyFilters(newSearch, newStatus) {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newStatus) params.set('status', newStatus);
    startTransition(() => {
      router.push(`/patients?${params.toString()}`);
    });
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    applyFilters(e.target.value, statusFilter);
  }

  function handleStatus(e) {
    setStatusFilter(e.target.value);
    applyFilters(search, e.target.value);
  }

  function exportCSV() {
    const headers = ['Name', 'Date of Birth', 'Phone', 'Email', 'City', 'State', 'Status', 'Created By'];
    const rows = patients.map(p => [
      `"${p.first_name} ${p.last_name}"`,
      p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : '',
      p.phone || '',
      p.email || '',
      p.city || '',
      p.state || '',
      p.is_active ? 'Active' : 'Inactive',
      `"${p.users?.full_name || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const canEdit = ['admin', 'billing', 'support'].includes(role);

  return (
    <div>
      {/* Search + Filter Bar */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, phone, or email..."
          style={{ flex: 1, minWidth: '220px', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
        />
        <select value={statusFilter} onChange={handleStatus}
          style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          <option value="">All Patients</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
        <button onClick={exportCSV}
          style={{ padding: '12px 18px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ⬇ Export CSV
        </button>
        {isPending && <span style={{ fontSize: '13px', color: '#718096' }}>Searching...</span>}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            {patients.length} patient{patients.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {patients.length > 0 ? (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>DOB</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Phone</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Location</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>
                      {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>{patient.phone || '—'}</td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>{patient.email || '—'}</td>
                    <td style={{ padding: '12px 8px', color: '#718096', fontSize: '13px' }}>
                      {[patient.city, patient.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: patient.is_active ? '#c6f6d5' : '#fed7d7', color: patient.is_active ? '#22543d' : '#742a2a' }}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link href={`/patients/${patient.id}`} style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>View →</Link>
                        {canEdit && (
                          <Link href={`/patients/${patient.id}/edit`} style={{ color: '#718096', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>Edit</Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No patients found</p>
            <p style={{ fontSize: '14px' }}>{search ? 'Try a different search term' : 'Add your first patient to get started'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
