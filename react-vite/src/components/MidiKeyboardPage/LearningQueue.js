import { LinkedList } from '../../utils/LinkedList';

export class LearningQueue {
  constructor(items = []) {
    this.linkedList = new LinkedList().fromArray(items);
    this.queue = [...this.linkedList.toArray()];
    this.masteredItems = new Map(); // Map to track mastered items with their status
    this.currentChallenge = null;
    this.startTime = null;
    this.stopwatchRef = null;
  }
  initialize(courseContent) {
    if (!courseContent) return;
    // Clear ALL existing data
    this.linkedList = new LinkedList();
    this.masteredItems = new Map(); // Create a new Map instead of just clearing
    this.queue = [];
    this.currentChallenge = null;
    this.startTime = null;

    // Handle different formats of course content
    if (courseContent.type === 'scale' && courseContent.notes) {
      courseContent.notes.forEach(note => {
        if (typeof note === 'string') {
          this.linkedList.append(note);
          this.masteredItems.set(note, { mastered: false, color: 'lightgrey' });
        } else {
          console.warn('Invalid note format:', note);
        }
      });
    } else if (Array.isArray(courseContent)) {
      courseContent.forEach(item => {
        if (typeof item === 'string') {
          const cleanItem = item.replace(',', '').trim();
          this.linkedList.append(cleanItem);
          this.masteredItems.set(cleanItem, { mastered: false, color: 'lightgrey' });
        } else {
          console.warn('Invalid item format:', item);
        }
      });
    }

    // Transform linkedList to plain string values for the queue
    this.queue = this.linkedList.toArray().map(item => {
      if (typeof item === 'object' && item !== null && 'value' in item) {
        return item.value; // Extract the string value
      }
      return item; // Already a string
    });

    console.log('Initialized queue with plain values:', this.queue);
    console.log('Initialized mastered items:', this.masteredItems);
  }
getNextChallenge() {
  if (this.queue.length === 0) {
    return null; // Queue is empty
  }

  // Get the next challenge from the queue
  const nextItem = this.queue.shift();

  // Standardize how we store currentChallenge - always as an object with a value property
  if (typeof nextItem === 'object' && nextItem !== null) {
    this.currentChallenge = nextItem;
  } else {
    // If it's a string or other primitive, wrap it in an object
    this.currentChallenge = { value: nextItem, mastered: false };
  }

  this.startTime = Date.now();

  // Reset stopwatch if provided
  if (this.stopwatchRef && this.stopwatchRef.current) {
    this.stopwatchRef.current.handleStartTimer();
  }

  // Always return the actual value to display, not the wrapper object
  return this.currentChallenge.value;
}

processResult(correct) {
  if (!this.currentChallenge || !correct) {
    console.log('ProcessResult called with invalid state', {
      currentChallenge: this.currentChallenge,
      correct
    });
    return null;
  }

  const timeTaken = (Date.now() - this.startTime) / 1000;

  // Get and log the current value being processed
  const currentValue = this.currentChallenge.value;
  console.log('Processing result for:', currentValue, 'Time taken:', timeTaken);

  // Now use currentValue which should be a valid string
  if (timeTaken < 2) {
    console.log('Fast answer, marking as mastered:', currentValue);
    this.masteredItems.set(currentValue, { mastered: true, color: 'red' });
  } else {
    console.log('Slower answer, not mastered yet:', currentValue);
    this.masteredItems.set(currentValue, { mastered: false, color: 'lightgrey' });

    // Re-queue based on time taken
    if (timeTaken < 4) {
      // End of queue
      this.queue.push({ value: currentValue, mastered: false });
    } else if (timeTaken < 5) {
      // Middle of queue
      const middlePosition = Math.floor(this.queue.length / 2);
      this.queue.splice(middlePosition, 0, { value: currentValue, mastered: false });
    } else {
      // Near front of queue
      this.queue.splice(1, 0, { value: currentValue, mastered: false });
    }
  }

  // Clear current challenge reference
  this.currentChallenge = null;

  // Check if all items are mastered
  const allMastered = [...this.masteredItems.entries()].every(([key, val]) => val.mastered);
  console.log('All mastered:', allMastered);

  // Get next challenge
  const nextChallenge = this.getNextChallenge();
  console.log('Next challenge:', nextChallenge);

  return {
    nextChallenge,
    allMastered
  };
}

getMasteredItems() {
  // Log the current state
  console.log('Getting mastered items from Map:', this.masteredItems);

  // Make sure we properly convert the Map to an array of objects
  return Array.from(this.masteredItems.entries()).map(([key, value]) => {
    return {
      name: key,
      color: value.color,
      mastered: value.mastered // Include this for debugging
    };
  });
}
/*
// Get next challenge from queue
getNextChallenge() {
  if (this.queue.length === 0) {
    console.log('Queue is empty');
    return null; // Queue is empty
  }

  // Get the next challenge from the queue
  const nextNode = this.queue.shift();
  console.log('Next node from queue:', nextNode);
  this.currentChallenge = nextNode;
  this.startTime = Date.now();

  // Reset stopwatch if provided
  if (this.stopwatchRef && this.stopwatchRef.current) {
    this.stopwatchRef.current.handleStartTimer();
  }

  // Make sure we return a string, not an object
  // Check what type of value we have and extract properly
  let challengeValue;

  if (nextNode && typeof nextNode === 'object') {
    // If it's an object with a value property, return that
    challengeValue = nextNode.value;
    console.log('Extracted challenge value from object:', challengeValue);
  } else {
    // If it's already a primitive value, use it directly
    challengeValue = nextNode;
    console.log('Using direct challenge value:', challengeValue);
  }

  // Final safeguard to ensure we return a string
  if (challengeValue && typeof challengeValue === 'object') {
    console.warn('Challenge value is still an object:', challengeValue);
    return String(challengeValue); // Force convert to string as fallback
  }

  return challengeValue;
}

*/


  // Get array of mastered items with their status


  // Reset the learning queue
  reset() {
    this.queue = [...this.linkedList.toArray()];
    this.currentChallenge = null;
    this.startTime = null;

    // Reset mastered status
    for (const [key] of this.masteredItems) {


      this.masteredItems.set(key, { mastered: false, color: 'lightgrey' });
    }

    // Reset stopwatch
    if (this.stopwatchRef && this.stopwatchRef.current) {
      this.stopwatchRef.current.handleStopTimer();
    }
  }

  // Set stopwatch reference for controlling timer
  setStopwatchRef(ref) {
    this.stopwatchRef = ref;
  }
}
