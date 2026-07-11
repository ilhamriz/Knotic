const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-subtle bg-bg-base px-6 md:px-10 py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-text-muted">© {year} Knotic</p>
        <p className="text-sm text-text-secondary">
          Built by{" "}
          <a
            href="https://ilhamriz.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors underline-offset-4 hover:underline"
          >
            Ilhamriz
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
