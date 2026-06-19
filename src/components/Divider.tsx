export default function Divider() {
  return (
    <div style={{ padding: '24px 0', backgroundColor: '#E8DCC8' }}>
      <img
        src="/divider.svg"
        alt=""
        aria-hidden="true"
        style={{
          width: 300,
          height: 'auto',
          display: 'block',
          margin: '0 auto',
          filter: 'sepia(40%) hue-rotate(340deg) saturate(200%) brightness(0.7)',
        }}
      />
    </div>
  );
}
