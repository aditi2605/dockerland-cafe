// components/common/LoadingSpinner.jsx — Shown while waiting for API responses
export default function LoadingSpinner({ message = 'Brewing your content...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-cafe-brown">
      {/* CSS-only spinning coffee cup */}
      <div className="text-5xl animate-spin" style={{ animationDuration: '1.5s' }}>☕</div>
      <p className="font-display text-lg">{message}</p>
    </div>
  )
}
