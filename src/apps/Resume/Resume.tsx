import './Resume.css';

export function Resume() {
  return (
    <div className="resume-app">
      <object
        className="resume-app__pdf"
        data="/Rishi_Krishna_Resume_2026.pdf#pagemode=none"
        type="application/pdf"
      >
        <p className="resume-app__fallback">
          Unable to display PDF.{' '}
          <a href="/Rishi_Krishna_Resume_2026.pdf" target="_blank" rel="noopener noreferrer">
            Download it here
          </a>
        </p>
      </object>
    </div>
  );
}
