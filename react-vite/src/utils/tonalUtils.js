import { Key, Chord } from 'tonal';

export const getTonalKeyInfo = (keyName) => {
  // Handle special case for input that might be chord names
  if (keyName.includes('m') || keyName.includes('dim') || keyName.includes('aug') ||
      keyName.includes('sus') || keyName.includes('7')) {
    return {
      type: 'chord',
      data: Chord.get(keyName),
      displayName: formatChordDisplayName(keyName)
    };
  }

  // Handle key/scale information
  try {
    const keyInfo = Key.majorKey(keyName);

    // Add a display-friendly name
    keyInfo.displayName = `${keyInfo.tonic} ${keyInfo.type}`;

    return {
      type: 'key',
      data: keyInfo,
      displayName: keyInfo.displayName
    };
  } catch (e) {
    // Return a simpler object if Tonal.js can't parse the key
    return {
      type: 'unknown',
      data: { name: keyName },
      displayName: keyName
    };
  }
};

// Format chord name for display to ensure consistency
export const formatChordDisplayName = (chordName) => {
  if (!chordName) return 'Unknown';

  const chordInfo = Chord.get(chordName);
  if (chordInfo.empty) return chordName; // Return original if Tonal can't parse

  // Return the properly formatted chord name from Tonal
  return `${chordInfo.tonic}${chordInfo.symbol}`;
};
