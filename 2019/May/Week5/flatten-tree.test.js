const { expect } = require('chai');
const flatten2tree = require('./flatten-tree');

describe('2019 May Week4 Test: flatten-tree', () => {
  it('two level without alias', () => {
    const flattenArr = [
      { id: 1, pid: 0, name: 'a', level: 1 },
      { id: 2, pid: 0, name: 'b', level: 1 },
      { id: 3, pid: 1, name: 'aa', level: 2 },
      { id: 4, pid: 1, name: 'ab', level: 2 },
    ];
    const tree = flatten2tree(flattenArr);
    expect(tree).to.be.an('array');
    expect(tree).to.have.lengthOf(2);
    expect(tree[0]).to.have.property('children');
    expect(tree[0].children).to.be.an('array');
    expect(tree[0].children).to.have.lengthOf(2);
    expect(tree[1].children).to.be.undefined;
  });

  it('two level with alias', () => {
    const flattenArr = [
      { sid: 1, psid: 0, name: 'a', slevel: 1 },
      { sid: 2, psid: 0, name: 'b', slevel: 1 },
      { sid: 3, psid: 1, name: 'aa', slevel: 2 },
      { sid: 4, psid: 1, name: 'ab', slevel: 2 },
    ];
    const tree = flatten2tree(flattenArr, 'sid', 'psid', 'slevel', 'items');
    expect(tree).to.be.an('array');
    expect(tree).to.have.lengthOf(2);
    expect(tree[0]).to.have.property('sid');
    expect(tree[0]).to.have.property('psid');
    expect(tree[0]).to.have.property('name');
    expect(tree[0]).to.have.property('slevel');
    expect(tree[0]).to.have.property('items');
    expect(tree[0].children).to.be.undefined;
    expect(tree[0].items).to.be.an('array');
    expect(tree[0].items).to.have.lengthOf(2);
    expect(tree[1].children).to.be.undefined;
  });

  it('deep level without alias', () => {
    const flattenArr = [
      { id: 1, pid: 0, name: 'a', level: 1 },
      { id: 2, pid: 0, name: 'b', level: 1 },
      { id: 3, pid: 1, name: 'aa', level: 2 },
      { id: 4, pid: 1, name: 'ab', level: 2 },
      { id: 5, pid: 2, name: 'ba', level: 2 },
      { id: 6, pid: 2, name: 'bb', level: 2 },
      { id: 7, pid: 0, name: 'c', level: 1 },
      { id: 8, pid: 4, name: 'aba', level: 3 },
      { id: 9, pid: 8, name: 'abaa', level: 4 },
    ];
    const tree = flatten2tree(flattenArr);
    expect(tree).to.be.an('array');
    expect(tree).to.have.lengthOf(3);
    expect(tree[0]).to.have.property('children');
    expect(tree[0].children).to.be.an('array');
    expect(tree[0].children).to.have.lengthOf(2);
    expect(tree).to.be.eql([
      {
        id: 1,
        pid: 0,
        name: 'a',
        level: 1,
        children: [
          { id: 3, pid: 1, name: 'aa', level: 2 },
          {
            id: 4,
            pid: 1,
            name: 'ab',
            level: 2,
            children: [
              {
                id: 8,
                pid: 4,
                name: 'aba',
                level: 3,
                children: [{ id: 9, pid: 8, name: 'abaa', level: 4 }],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        pid: 0,
        name: 'b',
        level: 1,
        children: [
          { id: 5, pid: 2, name: 'ba', level: 2 },
          { id: 6, pid: 2, name: 'bb', level: 2 },
        ],
      },
      { id: 7, pid: 0, name: 'c', level: 1 },
    ]);
  });
});
