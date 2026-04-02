import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SnowCraft: Free Browser Snowball Fight Game';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #87CEEB 0%, #e0f2fe 50%, #ffffff 100%)',
          fontFamily: 'monospace',
        }}
      >
        {/* Snow dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${6 + (i % 4) * 3}px`,
              height: `${6 + (i % 4) * 3}px`,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
              left: `${(i * 61) % 1200}px`,
              top: `${(i * 47) % 630}px`,
            }}
          />
        ))}

        <div
          style={{
            fontSize: 96,
            fontWeight: 'bold',
            color: '#2c3e50',
            textShadow: '4px 4px 0 #bdc3c7',
            marginBottom: 16,
          }}
        >
          SNOWCRAFT
        </div>

        <div
          style={{
            fontSize: 32,
            color: '#7f8c8d',
            marginBottom: 32,
          }}
        >
          A Fan Remake
        </div>

        {/* Snowmen */}
        <div style={{ display: 'flex', gap: 60 }}>
          {/* Red team */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e74c3c', border: '3px solid #c0392b' }} />
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ecf0f1', border: '2px solid #bdc3c7', marginTop: -8 }} />
          </div>

          <div style={{ fontSize: 48, color: '#34495e', fontWeight: 'bold', alignSelf: 'center' }}>VS</div>

          {/* Green team */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2ecc71', border: '3px solid #27ae60' }} />
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ecf0f1', border: '2px solid #bdc3c7', marginTop: -8 }} />
          </div>
        </div>

        <div
          style={{
            fontSize: 24,
            color: '#95a5a6',
            marginTop: 32,
          }}
        >
          3v3 Snowball Fight | 10 Levels | Free in Browser
        </div>
      </div>
    ),
    { ...size }
  );
}
