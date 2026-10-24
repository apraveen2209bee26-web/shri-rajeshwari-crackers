import { cn } from '../../lib/utils';

const variants = {
  primary: 'border border-coal-900 bg-coal-900 text-white hover:bg-coal-800',
  accent:
    'border border-ember-600 bg-ember-600 text-white shadow-glow hover:-translate-y-0.5 hover:bg-ember-700',
  soft: 'border border-amber-200 bg-amber-50 text-coal-900 hover:-translate-y-0.5 hover:bg-amber-100',
  ghost: 'border border-ember-200 bg-white text-ember-700 hover:-translate-y-0.5 hover:bg-ember-50',
  danger: 'border border-rose-600 bg-rose-600 text-white hover:bg-rose-700',
};

const Button = ({
  as: Component = 'button',
  className,
  children,
  variant = 'primary',
  type = 'button',
  ...props
}) => {
  const componentProps = {
    className: cn(
      'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold tracking-[0.02em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      className,
    ),
    ...props,
  };

  if (Component === 'button') {
    componentProps.type = type;
  }

  return <Component {...componentProps}>{children}</Component>;
};

export default Button;
