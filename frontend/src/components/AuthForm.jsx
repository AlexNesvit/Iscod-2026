export default function AuthForm({
  show,
  isAuthenticated,
  loginEmail,
  loginPassword,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onCreateAccount,
}) {
  if (!show || isAuthenticated) {
    return null;
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <input
        type="email"
        value={loginEmail}
        onChange={(event) => onEmailChange(event.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={loginPassword}
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Mot de passe"
      />
      <button type="submit">Se connecter</button>
      <button className="register-link" type="button" onClick={onCreateAccount}>
        Pas inscrit ? Creer un compte
      </button>
    </form>
  );
}
