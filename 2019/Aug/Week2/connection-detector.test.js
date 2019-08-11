const { expect } = require('chai');
const ConnectionDetector = require('./connection-detector');

describe('2019 Aug Week2 Test: connection-detector', () => {
  it('must add more than two nodes every time', () => {
    const cd = new ConnectionDetector();
    expect(() => { cd.addConnectedNodes({}); }).to.throw();
  });

  it('add two nodes each time', () => {
    const cd = new ConnectionDetector();
    cd.addConnectedNodes(1, 2);
    expect(cd.isConntectedTo(1, 2)).to.be.true;

    cd.addConnectedNodes(2, 3);
    expect(cd.isConntectedTo(2, 3)).to.be.true;
    expect(cd.isConntectedTo(1, 3)).to.be.true;

    cd.addConnectedNodes(5, 6);
    expect(cd.isConntectedTo(5, 6)).to.be.true;
    expect(cd.isConntectedTo(1, 5)).to.be.false;
    expect(cd.isConntectedTo(2, 6)).to.be.false;
  });

  it('add multiple nodes each time', () => {
    const cd = new ConnectionDetector();
    cd.addConnectedNodes(1, 2, 3);
    expect(cd.isConntectedTo(1, 2)).to.be.true;
    expect(cd.isConntectedTo(1, 3)).to.be.true;
    expect(cd.isConntectedTo(2, 3)).to.be.true;

    cd.addConnectedNodes(4, 5, 6, 7);
    expect(cd.isConntectedTo(4, 5)).to.be.true;
    expect(cd.isConntectedTo(4, 6)).to.be.true;
    expect(cd.isConntectedTo(4, 7)).to.be.true;

    expect(cd.isConntectedTo(1, 4)).to.be.false;
    expect(cd.isConntectedTo(3, 7)).to.be.false;
  });

  it('add object node with identify', () => {
    const cd = new ConnectionDetector({
      identify: o => o.id
    });
    const nodeA = {id: 1, node: 'a'};
    const nodeB = {id: 2, node: 'b'};
    const nodeC = {id: 3, node: 'c'};
    const nodeD = {id: 4, node: 'd'};

    cd.addConnectedNodes(nodeA, nodeB);
    expect(cd.isConntectedTo(nodeA, nodeB)).to.be.true;
    cd.addConnectedNodes(nodeA, nodeC);
    expect(cd.isConntectedTo(nodeB, nodeC)).to.be.true;
    expect(cd.isConntectedTo(nodeC, nodeD)).to.be.false;
  });
});
