export class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.mastered = false;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Add a node to the end of the list
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

  // Convert array to linked list
  fromArray(array) {
    array.forEach(item => this.append(item));
    return this;
  }

  // Insert a node at a specific position
  insertAt(node, position) {
    if (position <= 0 || !this.head) {
      // Insert at beginning
      node.next = this.head;
      this.head = node;
      if (!this.tail) this.tail = node;
    } else if (position >= this.size) {
      // Insert at end
      this.tail.next = node;
      this.tail = node;
      node.next = null;
    } else {
      // Insert in the middle
      let current = this.head;
      let count = 0;
      while (count < position - 1) {
        current = current.next;
        count++;
      }
      node.next = current.next;
      current.next = node;
    }
    this.size++;
  }

  // Remove a node
  remove(node) {
    if (!this.head) return null;

    if (this.head === node) {
      this.head = this.head.next;
      if (this.size === 1) this.tail = null;
      this.size--;
      return node;
    }

    let current = this.head;
    while (current.next && current.next !== node) {
      current = current.next;
    }

    if (current.next) {
      if (current.next === this.tail) {
        this.tail = current;
      }
      current.next = current.next.next;
      this.size--;
      return node;
    }

    return null;
  }

  // Convert to array for easier handling
  toArray() {
    const array = [];
    let current = this.head;
    while (current) {
      array.push(current);
      current = current.next;
    }
    return array;
  }

  // Get all mastered nodes
  getMasteredArray() {
    const array = [];
    let current = this.head;
    while (current) {
      if (current.mastered) {
        array.push(current.value);
      }
      current = current.next;
    }
    return array;
  }
}
