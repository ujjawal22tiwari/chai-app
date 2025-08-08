 const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "message", "type": "string" }
    ],
    "name": "buyChai",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMemos",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "message", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "address", "name": "from", "type": "address" }
        ],
        "internalType": "struct chai.Memo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider, signer, contract;

async function connectWallet() {
  if (window.ethereum) {
    // Ethers v6: BrowserProvider instead of Web3Provider
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    const account = await signer.getAddress();
    document.getElementById("account").innerText = account;

    contract = new ethers.Contract(contractAddress, contractABI, signer);

    getMemos();
  } else {
    alert("MetaMask not detected!");
  }
}

async function buyChai() {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  // Ethers v6: parseEther is direct function
  const amount = { value: ethers.parseEther("0.001") };

  const tx = await contract.buyChai(name, message, amount);
  await tx.wait();

  alert("Transaction successful!");
  getMemos();
}

async function getMemos() {
  const memos = await contract.getMemos();
  const memosContainer = document.getElementById("memos");
  memosContainer.innerHTML = "";

  memos.forEach(memo => {
    const div = document.createElement("div");
    div.className = "memo";
    div.innerHTML = `<strong>${memo.name}</strong> (${memo.from})<br>
      ${memo.message} <br>
      <small>${new Date(Number(memo.timestamp) * 1000).toLocaleString()}</small>`;
    memosContainer.appendChild(div);
  });
}

document.getElementById("pay").addEventListener("click", buyChai);
window.addEventListener("load", connectWallet);
