const { expect } = require('chai');
const PriorityQueue = require('./priority-queue');

describe('2019 Jul Week4 Test: priority-queue', () => {
  it('with init values, small is higher priority', () => {
    const queue = new PriorityQueue({
      initValues: [3, 2, 1]
    });

    expect(queue.length).to.be.equal(3);
    expect(queue.dequeue()).to.be.equal(1);
    expect(queue.length).to.be.equal(2);
    expect(queue.peek()).to.be.equal(2);
    expect(queue.dequeue()).to.be.equal(2);
    expect(queue.length).to.be.equal(1);
  });

  it('without init values, large is higher priority', () => {
    const queue = new PriorityQueue({
      comparator: (a, b) => a - b
    });

    queue.queue(1);
    queue.queue(2);
    queue.queue(3);

    expect(queue.length).to.be.equal(3);
    expect(queue.dequeue()).to.be.equal(3);
    expect(queue.length).to.be.equal(2);
    expect(queue.peek()).to.be.equal(2);
    expect(queue.dequeue()).to.be.equal(2);
    expect(queue.length).to.be.equal(1);
  });

  it('for object value, large is higher priority', () => {
    const queue = new PriorityQueue({
      comparator: (a, b) => a.priority - b.priority
    });

    queue.queue({name: 'zhangsan', priority: 1});
    queue.queue({name: 'lisi', priority: 2});
    queue.queue({name: 'wangwu', priority: 3});

    expect(queue.length).to.be.equal(3);
    expect(queue.peek()).to.be.eql({name: 'wangwu', priority: 3})
    expect(queue.dequeue()).to.be.eql({name: 'wangwu', priority: 3});
    expect(queue.length).to.be.equal(2);
    expect(queue.peek()).to.be.eql({name: 'lisi', priority: 2});
    expect(queue.dequeue()).to.be.eql({name: 'lisi', priority: 2});
    expect(queue.length).to.be.equal(1);

    queue.clear();
    expect(queue.length).to.be.equal(0);
  });
});
