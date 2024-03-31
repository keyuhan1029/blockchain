import React, { useState } from 'react';
// Correctly import ethers and Web3Provider directly
import { ethers } from 'ethers';
import {providers} from 'ethers';
import SimpleStorage_abi from "./simple_abi.json";

const Simple = () => {
    const contractAddress = "0x403657A78300d89e06d8eC922869ba0574297b57";
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [currentContractVal, setCurrentContractVal] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_requestAccounts" })
                .then(result => {
                    accountChangedHandler(result[0]);
                    setConnButtonText("Wallet connected!!");
                })
        } else {
            setErrorMessage("Need to install MetaMask");
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const updateEthers = () => {
        // Use ethers.providers.Web3Provider directly after importing { ethers } at the top
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        // Contract initialization remains the same
        let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
        setContract(tempContract);
    }

    const getCurrentVal = async() => {
        if (contract) {
            let val = await contract.retrieve();
            setCurrentContractVal(val.toString());
        }
    }

    const setHandler = async (event) => {
        event.preventDefault();
        const num = parseInt(event.target.setText.value, 10);
        if (!isNaN(num)) {
            try {
                await contract.store(num);
            } catch (error) {
                console.error("Failed to send transaction:", error);
                setErrorMessage("Transaction failed");
            }
        } else {
            console.error('Invalid input');
            setErrorMessage("Invalid input");
        }
    }

    return (
        <div>
            <h3>{"get/set interaction with contract"}</h3>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <h3>Address: {defaultAccount}</h3>

            <form onSubmit={setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>

            <button onClick = {getCurrentVal}>get current value</button>
            {currentContractVal}
            {errorMessage}
        </div>
    );
    }

export default Simple;
