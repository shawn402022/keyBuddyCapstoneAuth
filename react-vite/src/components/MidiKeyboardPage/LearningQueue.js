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

  // Initialize with course content
  initialize(courseContent) {
    if (!courseContent) return;

    // Clear existing data
    this.linkedList = new LinkedList();

    // Handle different formats of course content
    if (courseContent.type === 'scale' && courseContent.notes) {
      courseContent.notes.forEach(note => {
        this.linkedList.append(note);
        this.masteredItems.set(note, { mastered: false, color: 'lightgrey' });
      });
    } else if (Array.isArray(courseContent)) {
      courseContent.forEach(item => {
        const cleanItem = item.replace(',', '').trim();
        this.linkedList.append(cleanItem);
        this.masteredItems.set(cleanItem, { mastered: false, color: 'lightgrey' });
      });
    }

    // Initialize queue
    this.queue = [...this.linkedList.toArray()];
    this.currentChallenge = null;
  }

// Process challenge result based on time taken
// Process challenge result based on time taken
processResult(correct) {
  if (!this.currentChallenge || !correct) return;

  const timeTaken = (Date.now() - this.startTime) / 1000;
  const node = this.currentChallenge;

  // Store the current challenge before we change it
  const currentValue = node.value;

  if (timeTaken < 2) {
    // Mastered - remove from queue and mark as mastered
    node.mastered = true;
    this.masteredItems.set(currentValue, { mastered: true, color: 'red' });
  } else if (timeTaken < 4) {
    // Move to end of queue
    this.queue.push(node);
  } else if (timeTaken < 5) {
    // Move to middle of queue
    const middlePosition = Math.floor(this.queue.length / 2);
    this.queue.splice(middlePosition, 0, node);
  } else {
    // Move to second position
    this.queue.splice(1, 0, node);
  }

  // IMPORTANT: Clear the current challenge reference BEFORE getting next challenge
  this.currentChallenge = null;

  // Check if all items are mastered
  const allMastered = [...this.masteredItems.values()].every(item => item.mastered);

  // Delay getting the next challenge to prevent timing issues
  let nextChallenge = null;
  if (this.queue.length > 0) {
    nextChallenge = this.queue[0].value; // Peek at next value without removing it
  }

  return {
    nextChallenge: nextChallenge,
    allMastered: allMastered
  };
}


// Get next challenge from queue
getNextChallenge() {
  if (this.queue.length === 0) {
    return null; // Queue is empty
  }

  // Add a small delay before processing the next item
  if (this.currentChallenge !== null) {
    // If we're coming directly from another challenge, ensure we
    // don't accidentally mark it as mastered due to timing
    const minTimeBetweenChallenges = 3000; // 3 seconds in milliseconds
    const now = Date.now();
    if (now - this.startTime < minTimeBetweenChallenges) {
      // Force a reset of the start time to avoid false mastery
      this.startTime = now - minTimeBetweenChallenges;
    }
  }

  this.currentChallenge = this.queue.shift();
  this.startTime = Date.now();

  // Reset stopwatch if provided
  if (this.stopwatchRef && this.stopwatchRef.current) {
    this.stopwatchRef.current.handleStartTimer();
  }

  return this.currentChallenge.value;
}




  // Get array of mastered items with their status
  getMasteredItems() {
    return Array.from(this.masteredItems.entries()).map(([key, value]) => ({
      name: key,
      color: value.color
    }));
  }

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
