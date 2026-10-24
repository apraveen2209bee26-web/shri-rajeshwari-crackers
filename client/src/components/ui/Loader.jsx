const Loader = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-5 py-3 shadow-sm">
      <span className="h-3 w-3 animate-pulse rounded-full bg-ember-600" />
      <span className="text-sm font-semibold text-coal-800">{label}</span>
    </div>
  </div>
);

export default Loader;
