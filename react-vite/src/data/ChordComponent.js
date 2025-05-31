import keys from "./chord-data-tonal";

// Now you can use the keys array without needing the Tonal library
console.log('Available keys:', keys);

// Example usage
const cMajorKey = keys.find(k => k.name === 'CMajor');
console.log('C Major scale:', cMajorKey.key.scale);
