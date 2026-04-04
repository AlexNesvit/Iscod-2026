export default function SearchForm({ value, onChange, onSubmit, loadingAir }) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Enter city (Paris, Lyon...)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit" disabled={loadingAir}>
        {loadingAir ? 'Loading...' : 'Search'}
      </button>
    </form>
  );
}
