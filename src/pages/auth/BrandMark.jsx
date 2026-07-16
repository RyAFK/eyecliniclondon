export function BrandMark({ size = 44 }) {
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="mb-3">
        <circle cx="20" cy="20" r="19" stroke="#FFFFFF" strokeOpacity="0.5" />
        <path d="M4 20c5.5-8 12-12 16-12s10.5 4 16 12c-5.5 8-12 12-16 12S9.5 28 4 20Z" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="6.2" fill="#B08A4E" />
        <circle cx="20" cy="20" r="2.6" fill="#0B2545" />
      </svg>
      <p className="text-center text-white" style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '0.14em', lineHeight: 1.55 }}>
        EYE<br />CLINIC<br />LONDON
      </p>
    </div>
  );
}
