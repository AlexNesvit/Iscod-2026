export default function SearchForm({ value, onChange, onSubmit, loadingAir }) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Entrez une ville (Paris, Lyon...)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit" disabled={loadingAir}>
        {loadingAir ? 'Chargement...' : 'Rechercher'}
      </button>
    </form>
  );
}
