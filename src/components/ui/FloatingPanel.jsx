export default function FloatingPanel({ children, className = "", as: Component = "div", ...rest }) {
  return (
    <Component
      className={`rounded-2xl backdrop-blur-xl ${className}`}
      style={{
        backgroundColor: "rgba(21,21,34,0.55)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.4)",
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
