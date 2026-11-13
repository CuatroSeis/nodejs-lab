import { useNavigate } from "react-router-dom";

// Skip link para saltar contenido repetitivo (requisito WCAG 2.4.1)
export default function A11ySkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById("main-content");
        el?.focus();
      }}
    >
      Saltar al contenido principal
    </a>
  );
}
