import { ethers } from "./dependencies/ethers.min.js";
import { contractAddress, fundMeAbi } from "./Konstants.js";

const connectBtn = document.getElementById("connectWallet");
const fundBtn = document.getElementById("fundWallet");
const balanceBtn = document.getElementById("balanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

connectBtn.addEventListener('click', (e) => {
    connect();
});
fundBtn.addEventListener('click', (e) => {
    fund();
});
balanceBtn.addEventListener('click', (e) => {
    getBalance();
});
withdrawBtn.addEventListener('click', (e) => {
    withdraw();
});

async function getBalance() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log("Balance: ", ethers.formatEther((await provider.getBalance(contractAddress))));

}
async function connect() {
    console.log("Connect is clicked");
    fundMeAbi
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" })

        connectBtn.innerText = "Connected!";
    } else {
        connectBtn.innerText = "Install Metamask!";
    }
}

async function fund() {
    try {

        const ethAmount = ethers.parseEther(document.getElementById("EthAmount").value);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = (await provider.getSigner());
        const contract = new ethers.Contract(contractAddress, fundMeAbi, signer);
        const response = await contract.fund({ value: ethAmount })
        await response.wait(1)
        listenToTransactionMine(response, provider);
    }
    catch (err) {
        if (err.message.includes("ser rejected action"))
            console.log("User Rejected the tx");
        else
            console.log(err);

    }
}
async function withdraw() {
    if (!window.ethereum)
        console.log("Install Ethereum ")
    else if (!window.ethereum.isConnected()) {
        console.log("Connect Wallet!! ")
        connectBtn.innerHTML = "Connect Wallet";
    }
    else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = (await provider.getSigner());
        const contract = new ethers.Contract(contractAddress, fundMeAbi, signer);
        const txResponse = await contract.withdraw();
        listenToTransactionMine(txResponse, provider);
    }
}

function listenToTransactionMine(txResponse, provider) {
    provider.once(txResponse.hash, (receipt) => {
        receipt.confirmations().then(res => {
            console.log(`Confirmed tx with ${res} confirmations`);
        })
    })
}