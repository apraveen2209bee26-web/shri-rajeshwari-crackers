const EmptyState = ({ title, description, action }) => (
  <div className="glass-card p-8 text-center sm:p-10">
    <span className="festive-chip">Storefront status</span>
    <h3 className="font-display text-2xl font-bold text-coal-900">{title}</h3>
    <p className="mt-4 text-sm leading-7 text-coal-700">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
