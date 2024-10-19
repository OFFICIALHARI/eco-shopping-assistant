import { ethers } from "ethers";
import Greeter from "../artifacts/contracts/EcoMint.sol/EcoMint.json";
export async function requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}
const contractAddress = "0x654Ef553993477C20d295f3c0700fEEB9F9e62D3";
// Sets the greeting from input text box`
export async function sendReward() {
  // If MetaMask exists
  if (window.ethereum) {
    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, Greeter.abi, signer);
    // console.log("50");

    try {
      //   const transaction = await contract.transferTokens(quantity._value, {
      // value: ethers.utils.parseEther(`${quantity._value * 0.001}`),
      //   });
      const quantity = 50;
      const amountToSend = ethers.utils.parseUnits(quantity.toString(), 18); // Assuming 18 decimals, adjust if needed

      const tx = await contract.transferTokens(amountToSend);

      await tx.wait();
      console.log("Transaction hash:", tx.hash);
      console.log("Tokens transferred successfully");
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  }
}
