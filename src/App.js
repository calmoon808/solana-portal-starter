import React, { useState, useEffect } from "react";
import './App.css';

const TEST_ITEMS = [
  "https://c.tenor.com/R37rNJ-cvPYAAAAd/gme-tothemoon.gif",
  "https://c.tenor.com/sk8sBAjyj4wAAAAC/kognoff-chappelle.gif",
  "https://c.tenor.com/M7tMEFy5nYYAAAAC/gme-game-stop.gif"
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [itemList, setItemList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          // solana object gives us a function that will allow us to connect directly with the user's wallet
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected with public key:", response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phanto, Wallet 🕵️‍♂️");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with public key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  }

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  )

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendItem();
        }}
      >
        <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {itemList.map(item => (
          <div className="gif-item" key={item}>
            <img src={item} alt={item} />
          </div>
        ))}
      </div>
    </div>
  )

  const sendItem = async () => {
    if (inputValue.length > 0) {
      console.log("link:", inputValue);
      setItemList([...itemList, inputValue]);
      setInputValue("");
    } else {
      console.log("Nothing to input. Try again");
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching item list...");
      // Call Solana program here.

      // Set state
      setItemList(TEST_ITEMS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🐱‍👓 (TBD) Portal</p>
          <p className="sub-text">
            View your collection in the metaverse ✨
          </p>
          {walletAddress ? renderConnectedContainer() : renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          {/* <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a> */}
        </div>
      </div>
    </div>
  );
};

export default App;
