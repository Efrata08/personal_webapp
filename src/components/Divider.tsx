export default function Divider() {
  return (
    <div style={{ backgroundColor: '#E8DCC8', padding: '40px 0' }}>
      <svg width="100%" height="40" viewBox="0 0 800 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <line x1="0" y1="20" x2="360" y2="20" stroke="#C8941A" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="370" cy="20" r="2" fill="#C8941A" opacity="0.6"/>
        <rect x="388" y="12" width="16" height="16" fill="#C8941A" transform="rotate(45 396 20)"/>
        <circle cx="422" cy="20" r="2" fill="#C8941A" opacity="0.6"/>
        <line x1="432" y1="20" x2="800" y2="20" stroke="#C8941A" strokeWidth="0.8" opacity="0.5"/>
      </svg>
    </div>
  );
}
