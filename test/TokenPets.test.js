const { BN, expectRevert } = require('openzeppelin-test-helpers');
const { expect } = require('chai');

const TokenPets = artifacts.require('TokenPets.sol');

// Based on OpenZeppelin tests - MIT licence
// https://github.com/OpenZeppelin/openzeppelin-solidity
contract('TokenPets', function ([
  creator,
  ...accounts
]) {
  const name = 'TokenPets';
  const symbol = 'PET';
  const firstTokenId = new BN(1);
  const secondTokenId = new BN(2);
  const thirdTokenId = new BN(3);
  const nonExistentTokenId = new BN(999);

  const minter = creator;

  const [
    owner,
    newOwner,
  ] = accounts;

  beforeEach(async function () {
    this.token = await TokenPets.new({ from: creator });
  });

  describe('like an ERC721', function () {
    beforeEach(async function () {
      await this.token.mint(owner, { from: minter });
      await this.token.mint(owner, { from: minter });
    });

    describe('mint', function () {
      beforeEach(async function () {
        await this.token.mint(newOwner, { from: minter });
      });

      it('adjusts owner tokens by index', async function () {
        expect(await this.token.tokenOfOwnerByIndex(newOwner, 0)).to.be.bignumber.equal(thirdTokenId);
      });

      it('adjusts all tokens list', async function () {
        expect(await this.token.tokenByIndex(2)).to.be.bignumber.equal(thirdTokenId);
      });
    });

    describe('metadata', function () {
      const baseUri = 'https://abcoathup.github.io/tokenpets/apisampledata/tokenpet/';

      it('has a name', async function () {
        expect(await this.token.name()).to.be.equal(name);
      });

      it('has a symbol', async function () {
        expect(await this.token.symbol()).to.be.equal(symbol);
      });

      it('returns metadata for token', async function () {
        expect(await this.token.tokenURI(firstTokenId)).to.be.equal(baseUri + firstTokenId.toString());
        expect(await this.token.tokenURI(secondTokenId)).to.be.equal(baseUri + secondTokenId.toString());
      });

      it('reverts when querying metadata for non existent token id', async function () {
        await expectRevert(
          this.token.tokenURI(nonExistentTokenId), 'TokenPets: URI query for nonexistent token'
        );
      });
    });
  });
});
