import './LoginScreen.css';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-screen">
      <div className="login-screen__card">
        <img className="login-screen__avatar" src="/headshot.jpg" alt="Me" />
        <h2 className="login-screen__name">Rishi Krishna</h2>
        <form onSubmit={handleSubmit}>
          <button className="login-screen__btn" type="submit">
            Sign In ➤
          </button>
        </form>
      </div>
    </div>
  );
}
