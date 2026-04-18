// Normalise l'URL d'icone (ajoute https si l'URL commence par //).
function normalizeIconUrl(iconUrl) {
  if (!iconUrl) return null;
  if (iconUrl.startsWith('//')) return `https:${iconUrl}`;
  return iconUrl;
}

// Carte visuelle reutilisable pour afficher une metrique meteo.
export default function MetricCard({
  title,
  value,
  subtitle,
  rightIconUrl = null,
  rightIconAlt = '',
  largeRightIcon = false,
}) {
  const iconSrc = normalizeIconUrl(rightIconUrl);
  const withLargeIcon = largeRightIcon && iconSrc;

  return (
    <article className="metric-card">
      <p className="metric-title">{title}</p>

      {withLargeIcon ? (
        <div className="metric-content-split">
          <div className="metric-left">
            <p className="metric-value">{value}</p>
            {subtitle ? <p className="metric-subtitle">{subtitle}</p> : null}
          </div>
          <div className="metric-right-large-icon">
            <img className="metric-right-icon-large" src={iconSrc} alt={rightIconAlt} />
          </div>
        </div>
      ) : (
        <>
          <div className="metric-header">
            {iconSrc ? <img className="metric-right-icon" src={iconSrc} alt={rightIconAlt} /> : null}
          </div>
          <p className="metric-value">{value}</p>
          {subtitle ? <p className="metric-subtitle">{subtitle}</p> : null}
        </>
      )}
    </article>
  );
}
