export function StarRating({ rating }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= rating ? '⭐' : '☆'}</span>
      ))}
    </div>
  )
}