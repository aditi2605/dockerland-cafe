// Displays a single badge, used on the Progress page badge wall.

export default function BadgeCard({ badge, earned }) {
  return (
    <div
      style={{
        background:    earned
          ? 'rgba(29, 99, 237, 0.08)'
          : 'rgba(255, 255, 255, 0.02)',
        border:        earned
          ? '1px solid rgba(29, 99, 237, 0.25)'
          : '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius:  '14px',
        padding:       '20px 16px',
        textAlign:     'center',
        position:      'relative',
        overflow:      'hidden',
        transition:    'transform 0.2s, border-color 0.2s',
        cursor:        earned ? 'default' : 'not-allowed',
        opacity:       earned ? 1 : 0.5,
      }}
      // Slight lift on hover if earned
      onMouseEnter={e => {
        if (earned) e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Glow behind earned badge */}
      {earned && (
        <div style={{
          position:   'absolute',
          top:        '-20px',
          left:       '50%',
          transform:  'translateX(-50%)',
          width:      '80px',
          height:     '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,99,237,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Badge emoji or lock */}
      <div style={{
        fontSize:      '32px',
        marginBottom:  '10px',
        lineHeight:    1,
        filter:        earned ? 'none' : 'grayscale(1)',
        animation:     earned ? 'float 3s ease-in-out infinite' : 'none',
        // Stagger float animation per badge using index
        animationDelay: `${Math.random() * 1.5}s`,
      }}>
        {earned ? badge.emoji : '🔒'}
      </div>

      {/* Badge name */}
      <div style={{
        fontFamily:   "'Syne', sans-serif",
        fontSize:     '13px',
        fontWeight:   '700',
        color:        earned
          ? '#ffffff'
          : 'rgba(255,255,255,0.25)',
        marginBottom: '5px',
        lineHeight:   1.2,
      }}>
        {earned ? badge.name : '???'}
      </div>

      {/* Description */}
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize:   '11px',
        color:      earned
          ? 'rgba(255,255,255,0.4)'
          : 'rgba(255,255,255,0.15)',
        lineHeight: 1.5,
      }}>
        {earned
          ? badge.description
          : 'Keep learning to unlock'}
      </div>

      {/* Earned checkmark */}
      {earned && (
        <div style={{
          position:      'absolute',
          top:           '10px',
          right:         '10px',
          width:         '18px',
          height:        '18px',
          borderRadius:  '50%',
          background:    'rgba(61, 214, 140, 0.15)',
          border:        '1px solid rgba(61, 214, 140, 0.3)',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          fontSize:      '9px',
          color:         '#3DD68C',
        }}>
          ✓
        </div>
      )}

      {/* Shimmer sweep on earned badges */}
      {earned && (
        <div style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation:  'shimmer 3s linear infinite',
          pointerEvents: 'none',
          borderRadius: '14px',
        }} />
      )}
    </div>
  )
}