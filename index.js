import { ethers } from "./dependencies/ethers.min";


async function connect() {
    console.log("Connect is clicked");
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        document.getElementById("connectWallet").innerText = "Connected!";
    } else {
        document.getElementById("connectWallet").innerText = "Install Metamask!";
    }
}

async function fund(ethAmount) {

    if (window.ethereum) {

    }

}