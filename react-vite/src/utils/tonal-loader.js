// Create a dedicated loader for Tonal.js
export const loadTonal = async () => {
  const { Chord, Key } = await import('tonal');
  return { Chord, Key };
};
