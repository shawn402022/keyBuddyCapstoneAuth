export class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.mastered = false;
    this.responseTime = null;
  }
}

export class TrainingLinkedList {
  constructor(items = []) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.current = null;

    // Initialize with items if provided
    if (items.length) {
      this.initializeFromArray(items);
    }
  }

  initializeFromArray(items) {
    items.forEach(item => {
      this.append(item);
    });
    this.current = this.head;
  }

  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
    return newNode;
  }

  prepend(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.size++;
    return newNode;
  }

  getNext() {
    if (!this.current) {
      this.current = this.head;
    } else {
      this.current = this.current.next;
      if (!this.current) {
        this.current = this.head; // Loop back to start if at end
      }
    }
    return this.current;
  }

  insertAfter(targetValue, value) {
    let current = this.head;

    while (current && current.value !== targetValue) {
      current = current.next;
    }

    if (current) {
      const newNode = new Node(value);
      newNode.next = current.next;
      current.next = newNode;

      if (current === this.tail) {
        this.tail = newNode;
      }

      this.size++;
      return true;
    }

    return false;
  }

  insertAt(index, value) {
    if (index < 0 || index > this.size) {
      return null;
    }

    if (index === 0) {
      return this.prepend(value);
    }

    if (index === this.size) {
      return this.append(value);
    }

    const newNode = new Node(value);
    let current = this.head;
    let count = 0;

    while (count < index - 1) {
      current = current.next;
      count++;
    }

    newNode.next = current.next;
    current.next = newNode;
    this.size++;

    return newNode;
  }

  insertMiddle(value) {
    const middleIndex = Math.floor(this.size / 2);
    return this.insertAt(middleIndex, value);
  }

  remove(value) {
    if (!this.head) return null;

    if (this.head.value === value) {
      const removed = this.head;
      this.head = this.head.next;

      if (this.head === null) {
        this.tail = null;
      }

      this.size--;
      return removed;
    }

    let current = this.head;

    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      const removed = current.next;
      current.next = removed.next;

      if (removed === this.tail) {
        this.tail = current;
      }

      this.size--;
      return removed;
    }

    return null;
  }

  removeAt(index) {
    if (index < 0 || index >= this.size) {
      return null;
    }

    if (index === 0) {
      const removed = this.head;
      this.head = this.head.next;

      if (this.head === null) {
        this.tail = null;
      }

      this.size--;
      return removed;
    }

    let current = this.head;
    let count = 0;

    while (count < index - 1) {
      current = current.next;
      count++;
    }

    const removed = current.next;
    current.next = removed.next;

    if (removed === this.tail) {
      this.tail = current;
    }

    this.size--;
    return removed;
  }

  toArray() {
    const array = [];
    let current = this.head;

    while (current) {
      array.push(current.value);
      current = current.next;
    }

    return array;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  reset() {
    this.current = this.head;
  }

  handleResponseTime(responseTime) {
    if (!this.current) return;

    // Store response time
    this.current.responseTime = responseTime;
    const currentNode = this.current;

    // Apply spaced repetition algorithm based on response time
    if (responseTime < 2000) {
      // Fast response - remove from training and mark as mastered
      currentNode.mastered = true;
      this.remove(currentNode.value);
      return {
        mastered: true,
        value: currentNode.value,
        action: 'mastered'
      };
    } else if (responseTime < 4000) {
      // Good response - move to end
      this.remove(currentNode.value);
      this.append(currentNode.value);
      return {
        mastered: false,
        value: currentNode.value,
        action: 'moved-to-end'
      };
    } else if (responseTime < 5000) {
      // Moderate response - move to middle
      this.remove(currentNode.value);
      this.insertMiddle(currentNode.value);
      return {
        mastered: false,
        value: currentNode.value,
        action: 'moved-to-middle'
      };
    } else {
      // Slow response - move to second position
      this.remove(currentNode.value);
      if (this.size >= 1) {
        this.insertAt(1, currentNode.value);
      } else {
        this.append(currentNode.value);
      }
      return {
        mastered: false,
        value: currentNode.value,
        action: 'moved-to-second'
      };
    }
  }
}
