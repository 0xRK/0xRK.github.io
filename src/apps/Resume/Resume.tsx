import './Resume.css';

export function Resume() {
  return (
    <div className="resume-app">
      <object
        className="resume-app__pdf"
        data="/resume.pdf"
        type="application/pdf"
      >
        <p className="resume-app__fallback">
          Unable to display PDF.{' '}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Download it here
          </a>
        </p>
      </object>
    </div>
  );
}
