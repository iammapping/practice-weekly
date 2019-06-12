const { expect } = require('chai');
const { spy } = require('sinon');
const CallChain = require('./call-chain');

describe('2019 Jun Week3 Test: call-chain', () => {
  it('single call with chain', async () => {
    const cc = new CallChain((method, args) => {
      expect(method).to.be.eql('a.b.c');
      expect(args).to.be.an('array');
      expect(args).to.be.eql([1, 2, 3]);
    });

    await cc.a.b.c(1, 2, 3);
  });

  it('single call with no chain should meet error', async () => {
    const cc = new CallChain();
    expect(() => cc()).to.throw(TypeError);
  });

  it('multiple call with chain', async () => {
    const cc = new CallChain((method, args) => {
      expect(method).to.be.eql('a.b.c');
      expect(args).to.be.an('array');
      expect(args).to.be.eql([1, 2, 3]);
    });

    await cc.a.b.c(1, 2, 3);

    try {
      await cc.a.b();
    } catch (e) {
      expect(() => { throw e }).to.throw('expected \'a.b\' to deeply equal \'a.b.c\'');
    }
  });

  it('multiple call with chain use spy to detect', async () => {
    const cspy = spy()
    const cc = new CallChain(cspy);

    cc.a.b.c(1, 2, 3);
    cc.a.b(1, 2);

    expect(cspy.called).to.be.true;
    expect(cspy.callCount).to.be.equal(2);
    expect(cspy.getCall(0).args[0]).to.be.equal('a.b.c');
    expect(cspy.getCall(0).args[1]).to.be.eql([1, 2, 3]);
    expect(cspy.getCall(1).args[0]).to.be.equal('a.b');
    expect(cspy.getCall(1).args[1]).to.be.eql([1, 2]);
  });
});
