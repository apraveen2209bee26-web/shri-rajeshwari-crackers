const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    {eyebrow ? (
      <span className="festive-chip mb-4">
        {eyebrow}
      </span>
    ) : null}
    <h2 className="font-display text-3xl font-extrabold tracking-tight text-coal-900 sm:text-4xl lg:text-5xl">
      {title}
    </h2>
    {description ? <p className="mt-4 text-base leading-8 text-coal-700">{description}</p> : null}
    <div className={`${align === 'center' ? 'mx-auto' : ''} mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-ember-500 to-gold-400`} />
  </div>
);

export default SectionHeading;
