const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
// const { ethers } = require("hardhat");
const { v4: uuidv4 } = require("uuid");

describe("Supply chain management contract", () => {
    let itemId;
    let owner, addr1, addr2;
    let hardhatSupplyChain;
    async function deploySupplyChain() {
        itemId = uuidv4();
        [owner, addr1, addr2] = await ethers.getSigners();

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        hardhatSupplyChain = await supplyChain.deployed();
    }

    describe("Deployment", () => {
        it("checks that owner is accurate", async() => {
            await deploySupplyChain();
            const supplyChainOwner = await hardhatSupplyChain.owner();
            expect(supplyChainOwner).to.equal(owner.address);
        });
    });

    describe("Transactions", () => {
        it("checks that owner can create item", async() => {
            //let tx = await hardhatSupplyChain.createItem(itemId, "Versace shoes");
            //let transaction = await tx.wait();
            //expect(transaction.events[0].event).to.equal("ItemCreated");
            expect(await hardhatSupplyChain.createItem(itemId, "Versace shoes"))
                .to.emit(hardhatSupplyChain, "ItemCreated")
                .withArgs(itemId);
        });

        it("checks that owner can transfer created item", async() => {
            //tx = await hardhatSupplyChain.transferItem(itemId, addr1.address);
            //transaction = await tx.wait();
            //expect(transaction.events[0].event).to.equal("ItemTransferred");
            expect(await hardhatSupplyChain.transferItem(itemId, addr1.address))
                .to.emit(hardhatSupplyChain, "ItemTransferred")
                .withArgs(itemId, owner.address, addr1.address);
            expect((await hardhatSupplyChain.items(itemId)).owner).to.equal(
                addr1.address
            );
        });

        it("checks that a user can transfer received item", async() => {
            //tx = await hardhatSupplyChain
            //    .connect(addr1)
            //    .transferItem(itemId, addr2.address);
            //transaction = await tx.wait();
            //expect(transaction.events[0].event).to.equal("ItemTransferred");
            expect(
                    await hardhatSupplyChain
                    .connect(addr1)
                    .transferItem(itemId, addr2.address)
                )
                .to.emit(hardhatSupplyChain, "ItemTransferred")
                .withArgs(itemId, addr1.address, addr2.address);
            expect((await hardhatSupplyChain.items(itemId)).owner).to.equal(
                addr2.address
            );
        });
    });
});