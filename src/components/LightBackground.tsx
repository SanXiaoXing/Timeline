const LightBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ backgroundColor: '#F6F2EB' }}
      aria-hidden="true"
    />
  );
};

export default LightBackground;