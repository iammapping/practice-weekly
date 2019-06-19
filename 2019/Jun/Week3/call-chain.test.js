const { expect } = require('chai');
const { spy } = require('sinon');
const lolex = require("lolex");
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

    await cc.a.b.c(1, 2, 3);
    await cc.a.b(1, 2);

    expect(cspy.called).to.be.true;
    expect(cspy.callCount).to.be.equal(2);
    expect(cspy.getCall(0).args[0]).to.be.equal('a.b.c');
    expect(cspy.getCall(0).args[1]).to.be.eql([1, 2, 3]);
    expect(cspy.getCall(1).args[0]).to.be.equal('a.b');
    expect(cspy.getCall(1).args[1]).to.be.eql([1, 2]);
  });

  it('call with async/await', async () => {
    const clock = lolex.createClock();
    const sleep = (delay) => new Promise(resolve => clock.setTimeout(resolve, delay));
    const spy1 = spy();
    const spy2 = spy();
    const spy3 = spy();
    const cc1 = new CallChain(async () => {
      spy1();
    });
    const cc2 = new CallChain(async () => {
      await sleep(100);
      spy2();
    });
    const cc3 = new CallChain(async () => {
      await sleep(200);
      spy3();
    });

    const p1 = cc1.xx();
    const p2 = cc2.xx();
    const p3 = cc3.xx();

    await p1;
    expect(spy1.called).to.be.true;
    expect(spy2.called).to.be.false;
    expect(spy3.called).to.be.false;

    setTimeout(() => clock.tick(100), 0)
    await p2;
    expect(spy1.called).to.be.true;
    expect(spy2.called).to.be.true;
    expect(spy3.called).to.be.false;

    setTimeout(() => clock.tick(100), 0)
    await p3;
    expect(spy1.called).to.be.true;
    expect(spy2.called).to.be.true;
    expect(spy3.called).to.be.true;
  });
});
