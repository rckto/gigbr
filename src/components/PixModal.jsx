import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { IconPixSymbol, IconCheck, IconCopy } from './Icons';

const PixModal = () => {
  const { pixModal, setPixModal, executePixPayment, t } = useContext(AppContext);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!pixModal.show || !pixModal.shift || !pixModal.contractor) return null;

  const { shift, contractor } = pixModal;
  const amount = (shift.actualHours || shift.scheduledHours) * shift.hourlyRate;
  
  // Simulated PIX Copy-Paste Key
  const pixCopyKey = `00020101021226840014br.gov.bcb.pix256245.678.901/0001-235204000053039865404${amount.toFixed(2)}5802BR5925${contractor.name.substring(0, 20).replace(/\s/g, '')}6009SAOPAULO62070503***6304`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCopyKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      executePixPayment(shift.id);
      setLoading(false);
    }, 1500); // Simulate transaction delay
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '30px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16, 185, 129, 0.1)',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '8px',
            borderRadius: '10px',
            color: 'var(--color-green)'
          }}>
            <IconPixSymbol className="w-6 h-6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-accent)' }}>
              {t.pixModalTitle}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Gateway de Liquidação Instantânea Banco Central do Brasil
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{
          backgroundColor: '#f4f4f5',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.receiptContractor}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{contractor.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.receiptCnpj}</span>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{contractor.cnpj}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.category} / MEI:</span>
            <span style={{ fontSize: '0.8rem' }} className="badge badge-green">{contractor.role}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{t.receiptAmount}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-green)' }}>
              R$ {amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* PIX Dynamic QR Code Simulation */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            background: '#ffffff',
            padding: '12px',
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '12px'
          }}>
            {/* Styled Simulated QR Code using CSS grid */}
            <div style={{
              width: '180px',
              height: '180px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Cpath d='M0 0h30v10H10v20H0zm70 0h30v30h-10V10H70zm0 70h20v20H70v-10h10V80h-10zm-70 0h10v20H0v-10h10V80H0zm20 20h20v-10H20zm40-30h10v10H60zm0 10h10v10H60zm-30 0h10v10H30zm10-20h10v10H40zm0 10h10v10H40zm10-40h10v10H50zm10 10h10v10H60zM20 20h10v10H20zm30 10h10v10H50zM10 40h10v10H10zm30 0h10v10H40zm30 0h10v10H70zM10 60h10v10H10zm40 0h10v10H50zm30 0h10v10H70z' fill='black'/%3E%3C/svg%3E")`,
              backgroundSize: '100% 100%',
              opacity: loading ? 0.3 : 1
            }} />
            
            {/* Center Pix Logo */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              border: '2px solid #000',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
            }}>
              <IconPixSymbol className="w-6 h-6" style={{ color: '#059669' }} />
            </div>

            {loading && (
              <div style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-green)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                <div style={{
                  border: '3px solid rgba(16, 185, 129, 0.3)',
                  borderTop: '3px solid var(--color-green)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '8px'
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>
            {t.pixDesc}
          </p>
        </div>

        {/* Copy-Paste Key */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <input 
            type="text" 
            readOnly 
            value={pixCopyKey} 
            style={{
              flexGrow: 1,
              backgroundColor: '#f4f4f5',
              border: '1px solid #d4d4d8',
              color: 'var(--text-main)',
              fontSize: '0.7rem',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          />
          <button 
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ padding: '10px 14px' }}
            title={t.pixKeyCopy}
          >
            {copied ? <IconCheck style={{ color: 'var(--color-green)' }} /> : 'Copiar'}
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setPixModal({ show: false, shift: null, contractor: null })}
            className="btn btn-secondary"
            style={{ flexGrow: 1 }}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            className="btn btn-primary"
            style={{ flexGrow: 2 }}
            disabled={loading}
          >
            {loading ? 'Liquidando...' : t.pixConfirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PixModal;
