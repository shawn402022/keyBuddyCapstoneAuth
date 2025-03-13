import { Chord } from 'tonal';

// LRU Cache for chord detection results
class ChordCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  // Generate a unique key from the notes array
  getKey(notes) {
    return notes.sort().join(',');
  }

  get(notes) {
    return this.cache.get(this.getKey(notes));
  }

  set(notes, result) {
    const key = this.getKey(notes);

    // Implement LRU eviction policy
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, result);
  }
}

class OptimizedChordDetector {
  constructor() {
    this.cache = new ChordCache();

    // Define common chord patterns for quick detection
    this.commonPatterns = {
      // G7 pattern (G dominant 7th)
      'G7': (noteNames) => {
        const roots = noteNames.map(n => n.charAt(0));
        return noteNames.length === 4 &&
               roots.includes('G') &&
               roots.includes('B') &&
               roots.includes('D') &&
               roots.includes('F');
      },

      // Bm7b5 pattern (half-diminished)
      'Bm7b5': (noteNames) => {
        const roots = noteNames.map(n => n.charAt(0));
        return noteNames.length === 4 &&
               roots.includes('B') &&
               roots.includes('D') &&
               roots.includes('F') &&
               roots.includes('A');
      },

      // Bdim7 pattern
      'Bdim7': (noteNames) => {
        const roots = noteNames.map(n => n.charAt(0));
        const hasGSharp = noteNames.some(n => n.includes('G#'));
        return noteNames.length === 4 &&
               roots.includes('B') &&
               roots.includes('D') &&
               roots.includes('F') &&
               hasGSharp;
      }
    };
  }

  // Format notes consistently for chord detection
  formatNotes(playedNotes) {
    return playedNotes.map(note => {
      const noteLetter = note.key.split('/')[0];
      const baseName = noteLetter.toUpperCase();
      const properNoteName = note.isSharp ? `${baseName}#` : baseName;
      return `${properNoteName}${note.octave}`;
    });
  }

  // Main detection method with caching
  detectChord(playedNotes) {
    if (!playedNotes || playedNotes.length < 2) {
      return 'Unknown Chord';
    }

    const noteNames = this.formatNotes(playedNotes);

    // Check cache first
    const cachedResult = this.cache.get(noteNames);
    if (cachedResult) {
      console.log("Chord detection cache hit:", cachedResult);
      return cachedResult;
    }

    // Check common patterns first (fastest)
    for (const [chordName, matcher] of Object.entries(this.commonPatterns)) {
      if (matcher(noteNames)) {
        this.cache.set(noteNames, chordName);
        return chordName;
      }
    }

    // Fall back to Tonal.js with optimized handling
    let detectedChord = this.detectWithTonal(noteNames);

    // Store in cache
    this.cache.set(noteNames, detectedChord);
    return detectedChord;
  }

  // Optimized Tonal.js detection
  detectWithTonal(noteNames) {
    const detected = Chord.detect(noteNames, { assumePerfectFifth: false });

    if (detected.length === 0) return 'Unknown Chord';

    const chordInfo = Chord.get(detected[0]);
    const intervals = chordInfo.intervals || [];
    const formattedName = chordInfo.tonic || '';

    // Optimized interval checking with lookup maps instead of conditionals
    if (this.hasIntervalPattern(intervals, ['3M', '5P', '7m'])) {
      return `${formattedName}7`; // Dominant 7th
    }

    if (this.hasIntervalPattern(intervals, ['3m', '5d', '7m'])) {
      return `${formattedName}m7b5`; // Half-diminished
    }

    if (this.hasIntervalPattern(intervals, ['3m', '5d', '7d'])) {
      return `${formattedName}dim7`; // Diminished 7th
    }

    if (this.hasIntervalPattern(intervals, ['3M', '5d'])) {
      return `${formattedName}Mb5`; // Major with flat 5th
    }

    // Simplified lookup table approach instead of switch-case
    const qualityMap = {
      'Major': this.handleMajorChord,
      'Minor': this.handleMinorChord,
      'Diminished': this.handleDiminishedChord,
      'Major Seventh': () => `${formattedName}maj7`,
      'Dominant Seventh': () => `${formattedName}7`,
      'Minor Seventh': () => `${formattedName}m7`,
      'Half Diminished': () => `${formattedName}m7b5`,
    };

    // Use the lookup table to determine chord format
    const handler = qualityMap[chordInfo.quality];
    if (handler) {
      return handler.call(this, formattedName, intervals);
    }

    // For other chord types - use interval analysis
    return this.analyzeChordByIntervals(formattedName, intervals);
  }

  hasIntervalPattern(intervals, pattern) {
    return pattern.every(interval => intervals.includes(interval));
  }

  handleMajorChord(root, intervals) {
    if (intervals.includes('7m')) {
      return `${root}7`;
    } else if (intervals.includes('5A')) {
      return `${root}aug`;
    } else if (intervals.includes('7M')) {
      return `${root}maj7`;
    }
    return root; // Plain major chord
  }

  handleMinorChord(root, intervals) {
    if (intervals.includes('7m')) {
      return `${root}m7`;
    }
    return `${root}m`;
  }

  handleDiminishedChord(root, intervals) {
    if (intervals.includes('7d')) {
      return `${root}dim7`;
    }
    return `${root}dim`;
  }

  analyzeChordByIntervals(root, intervals) {
    // Precompute interval flags (more efficient than repeated includes calls)
    const hasIntervals = {
      '3M': intervals.includes('3M'),
      '3m': intervals.includes('3m'),
      '5d': intervals.includes('5d'),
      '5A': intervals.includes('5A'),
      '7m': intervals.includes('7m'),
      '7M': intervals.includes('7M')
    };

    if (hasIntervals['3M']) {
      if (hasIntervals['7m']) return `${root}7`;
      if (hasIntervals['7M']) return `${root}maj7`;
      if (hasIntervals['5d']) return `${root}Mb5`;
      if (hasIntervals['5A']) return `${root}aug`;
      return root;
    }

    if (hasIntervals['3m']) {
      if (hasIntervals['7m']) return `${root}m7`;
      if (hasIntervals['7M']) return `${root}mM7`;
      return `${root}m`;
    }

    // Fall back to tonal's symbol
    const chordInfo = Chord.get(`${root}${intervals.join('')}`);
    return `${root}${chordInfo.symbol || ''}`;
  }
}

// Export a singleton instance
export default new OptimizedChordDetector();
