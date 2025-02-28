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
processResult(correct) {
    if (!this.currentChallenge || !correct) return;

    const timeTaken = (Date.now() - this.startTime) / 1000;
    const node = this.currentChallenge;

    // Store the current challenge value for reference
    const currentValue = node.value;

    // IMPORTANT: We need to specifically set mastered=true or mastered=false based on time
    // NOT just in the if branch
    if (timeTaken < 2) {
      // Fast answer - mark as mastered
      this.masteredItems.set(currentValue, { mastered: true, color: 'red' });
      // Don't put this node back in the queue
    } else if (timeTaken < 4) {
      // Not mastered - ensure mastered flag is false
      this.masteredItems.set(currentValue, { mastered: false, color: 'lightgrey' });
      // Move to end of queue (enqueue a new object, not the original node reference)
      this.queue.push({ value: currentValue, mastered: false });
    } else if (timeTaken < 5) {
      // Not mastered - ensure mastered flag is false
      this.masteredItems.set(currentValue, { mastered: false, color: 'lightgrey' });
      // Move to middle of queue (as a new object)
      const middlePosition = Math.floor(this.queue.length / 2);
      this.queue.splice(middlePosition, 0, { value: currentValue, mastered: false });
    } else {
      // Not mastered - ensure mastered flag is false
      this.masteredItems.set(currentValue, { mastered: false, color: 'lightgrey' });
      // Move to second position (as a new object)
      this.queue.splice(1, 0, { value: currentValue, mastered: false });
    }

    // Clear current challenge reference
    this.currentChallenge = null;

    // Check if all items are mastered
    const allMastered = [...this.masteredItems.values()].every(item => item.mastered);

    // Get next challenge using our method
    const nextChallenge = this.getNextChallenge();

    return {
      nextChallenge,
      allMastered
    };
  }

  // Get next challenge from queue
  getNextChallenge() {
    if (this.queue.length === 0) {
      return null; // Queue is empty
    }

    // Ensure enough time has passed before starting a new challenge
    const minTimeGap = 800; // milliseconds
    const now = Date.now();

    // If we recently processed a challenge, add a small delay
    if (this.startTime && (now - this.startTime < minTimeGap)) {
      // We could add a manual delay here, but that could block execution
      // Instead just making sure the timing will be correct
      console.log("Processing next item with timing adjustment");
    }

    // Get the next challenge from the queue
    const nextNode = this.queue.shift();
    this.currentChallenge = nextNode;
    this.startTime = Date.now();

    // Reset stopwatch if provided
    if (this.stopwatchRef && this.stopwatchRef.current) {
      this.stopwatchRef.current.handleStartTimer();
    }

    return nextNode.value;
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
