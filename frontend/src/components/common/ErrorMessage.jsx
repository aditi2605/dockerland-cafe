// components/common/ErrorMessage.jsx
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="max-w-lg mx-auto my-16 text-center">
      <div className="text-6xl mb-4">😵</div>
      <h2 className="font-display text-2xl text-cafe-brown mb-2">The kitchen hit a snag!</h2>
      <p className="text-gray-600 mb-6">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  )
}
