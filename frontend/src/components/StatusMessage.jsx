// Affiche un message de statut uniquement s'il existe.
export default function StatusMessage({ message }) {
  if (!message) {
    return null;
  }

  return <p className="status-message">{message}</p>;
}
