import slugify from './slugify.js';

const buildSkuBase = (name = '') => {
  const normalized = slugify(name);

  if (!normalized) {
    return 'ITEM';
  }

  const parts = normalized
    .split('-')
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.slice(0, 3).toUpperCase());

  return parts.join('') || 'ITEM';
};

const generateSkuCandidate = (name, sequence = 1) => {
  const base = buildSkuBase(name);
  const suffix = String(sequence).padStart(3, '0');
  return `CRK-${base}-${suffix}`;
};

export { generateSkuCandidate };
