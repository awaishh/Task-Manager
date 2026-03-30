// Reusable primary button with the purple gradient
export default function Btn({ children, className = '', style = {}, ...props }) {
  return (
    <button
      className={`rounded-lg text-white font-medium text-sm tracking-tight hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)', ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
