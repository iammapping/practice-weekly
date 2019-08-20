const { expect } = require('chai');
const { Graph } = require('./graph-path');

describe('2019 Aug Week3 Test: graph-path', () => {
  it('has path to', () => {
    const graph = new Graph([
      [0, 1],
      [1, 2],
      [1, 4]
    ]);
    const paths0 = graph.search(0);
    expect(paths0.hasPathTo(0)).to.be.true;
    expect(paths0.hasPathTo(1)).to.be.true;
    expect(paths0.hasPathTo(2)).to.be.true;
    expect(paths0.hasPathTo(3)).to.be.false;
    expect(paths0.hasPathTo(4)).to.be.true;

    const paths1 = graph.search(1);
    expect(paths1.hasPathTo(0)).to.be.true;
    expect(paths1.hasPathTo(1)).to.be.true;
    expect(paths1.hasPathTo(2)).to.be.true;
    expect(paths1.hasPathTo(3)).to.be.false;
    expect(paths1.hasPathTo(4)).to.be.true;
  });

  it('path to', () => {
    const graph = new Graph([
      [0, 1],
      [1, 2],
      [1, 4],
    ]);
    graph.addNodePair([4, 5]);
    const paths0 = graph.search(0);
    expect(paths0.pathTo(1)).to.be.eql([0, 1]);
    expect(paths0.pathTo(2)).to.be.eql([0, 1, 2]);
    expect(paths0.pathTo(3)).to.be.null;
    expect(paths0.pathTo(4)).to.be.eql([0, 1, 4]);
    expect(paths0.pathTo(5)).to.be.eql([0, 1, 4, 5]);
  });

  it('path to after research', () => {
    const graph = new Graph([
      [0, 1]
    ]);

    let paths = graph.search(0);
    expect(paths.hasPathTo(2)).to.be.false;
    expect(paths.pathTo(2)).to.be.null;

    graph.addNodePair([1, 2]);
    paths = graph.search(0);
    expect(paths.hasPathTo(2)).to.be.true;
    expect(paths.pathTo(2)).to.be.eql([0, 1, 2]);
  });
});
