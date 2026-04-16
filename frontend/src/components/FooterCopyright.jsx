export default function FooterCopyright({ className = '' }) {
  const classes = ['copyright-footer', className].filter(Boolean).join(' ');

  return (
    <footer className={classes}>
      <span>Copyright © 2026 by </span>
      <a href="https://card.alexnesvit.com/" target="_blank" rel="noreferrer">
        Alex NESVIT
      </a>
      <span> | All Rights Reserved.</span>
    </footer>
  );
}
