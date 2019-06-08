const { expect } = require('chai');
const lookupTreePath = require('./tree-path');

const { ALWAYS_CHILDREN, WITHOUT_CHILDREN } = lookupTreePath.LOOKUPTYPE;

describe('2019 Jun Week2 Test: tree-path', () => {
  const tree = [
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
      children: [{ id: 5, pid: 2, name: 'ba', level: 2 }, { id: 6, pid: 2, name: 'bb', level: 2 }],
    },
    { id: 7, pid: 0, name: 'c', level: 1 },
  ];

  it('lookup only leaf by object', () => {
    expect(lookupTreePath(tree, { id: 7 })).to.be.eql([[{ id: 7, pid: 0, name: 'c', level: 1 }]]);
    expect(lookupTreePath(tree, { id: 4 })).to.be.eql([]);
    expect(lookupTreePath(tree, { id: 9 })).to.be.eql([
      [
        { id: 1, pid: 0, name: 'a', level: 1 },
        { id: 4, pid: 1, name: 'ab', level: 2 },
        { id: 8, pid: 4, name: 'aba', level: 3 },
        { id: 9, pid: 8, name: 'abaa', level: 4 },
      ],
    ]);
  });

  it('lookup only leaf by fn in object', () => {
    expect(lookupTreePath(tree, { name: n => n === 'aa' })).to.be.eql([
      [{ id: 1, pid: 0, name: 'a', level: 1 }, { id: 3, pid: 1, name: 'aa', level: 2 }],
    ]);
    expect(lookupTreePath(tree, { name: n => n === 'aa', level: 3 })).to.be.eql([]);
  });

  it('lookup only leaf by fn', () => {
    expect(lookupTreePath(tree, node => node.name === 'aa')).to.be.eql([
      [{ id: 1, pid: 0, name: 'a', level: 1 }, { id: 3, pid: 1, name: 'aa', level: 2 }],
    ]);
    expect(lookupTreePath(tree, node => node.name === 'aa' && node.level === 3)).to.be.eql([]);
    expect(lookupTreePath(tree, node => node.name === 'aa' || node.level === 3)).to.be.eql([
      [{ id: 1, pid: 0, name: 'a', level: 1 }, { id: 3, pid: 1, name: 'aa', level: 2 }],
    ]);
    expect(lookupTreePath(tree, node => node.name === 'b')).to.be.eql([]);
    expect(lookupTreePath(tree, node => node.name.indexOf('b') === 0)).to.be.eql([
      [{ id: 2, pid: 0, name: 'b', level: 1 }, { id: 5, pid: 2, name: 'ba', level: 2 }],
      [{ id: 2, pid: 0, name: 'b', level: 1 }, { id: 6, pid: 2, name: 'bb', level: 2 }],
    ]);
    expect(lookupTreePath(tree, node => node.name === 'aa' || node.name === 'abaa')).to.be.eql([
      [{ id: 1, level: 1, name: 'a', pid: 0 }, { id: 3, level: 2, name: 'aa', pid: 1 }],
      [
        { id: 1, level: 1, name: 'a', pid: 0 },
        { id: 4, level: 2, name: 'ab', pid: 1 },
        { id: 8, level: 3, name: 'aba', pid: 4 },
        { id: 9, level: 4, name: 'abaa', pid: 8 },
      ],
    ]);
    expect(
      lookupTreePath(tree, node => node.name === 'aa' || node.name === 'abaa' || node.name === 'ba')
    ).eql([
      [{ id: 1, pid: 0, name: 'a', level: 1 }, { id: 3, pid: 1, name: 'aa', level: 2 }],
      [
        { id: 1, pid: 0, name: 'a', level: 1 },
        { id: 4, pid: 1, name: 'ab', level: 2 },
        { id: 8, pid: 4, name: 'aba', level: 3 },
        { id: 9, pid: 8, name: 'abaa', level: 4 },
      ],
      [{ id: 2, pid: 0, name: 'b', level: 1 }, { id: 5, pid: 2, name: 'ba', level: 2 }],
    ]);
  });

  it('lookup always with children by fn', () => {
    expect(lookupTreePath(tree, node => node.name === 'b', ALWAYS_CHILDREN)).to.be.eql([
      [{ id: 2, pid: 0, name: 'b', level: 1 }, { id: 5, pid: 2, name: 'ba', level: 2 }],
      [{ id: 2, pid: 0, name: 'b', level: 1 }, { id: 6, pid: 2, name: 'bb', level: 2 }],
    ]);
  });

  it('lookup without children by fn', () => {
    expect(lookupTreePath(tree, node => node.name.indexOf('b') === 0, WITHOUT_CHILDREN)).to.be.eql([
      [{ id: 2, pid: 0, name: 'b', level: 1 }],
    ]);
  });
});
