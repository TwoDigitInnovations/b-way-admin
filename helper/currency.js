function Currency(amount) {
  const absAmount = Math.abs(amount);

  if (absAmount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }

  if (absAmount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default Currency;
