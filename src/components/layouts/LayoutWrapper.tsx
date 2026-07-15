const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-[calc(100vh-70px)] pt-16">{children}</div>;
};

export default LayoutWrapper;
