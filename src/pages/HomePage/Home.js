import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "./../../redux/data/dataActions";
import * as s from "./../../styles/globalStyles";
import whitelistAddresses from "../walletAddresses";
import Loader from "../../components/Loader/loader";
import NavbarPrimary from "../../components/Navbar/NavbarPrimary";

import { MinusIcon, PlusIcon } from "@heroicons/react/outline";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
var Web3 = require("web3");
var Contract = require("web3-eth-contract");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

// Whitelist MerkleTree
// const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
// const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
// const rootHash = merkleTree.getRoot();
// console.log("Whitelist Merkle Tree\n", merkleTree.toString());

function Home() {
  const list = [
    {
      text: `Ongoing access to monthly mastermind sessions where the focus is on accomplishment through collaboration.`,
    },
    { text: `We meet the second Tuesday of each month at 1 pm PST ` },
    {
      text: `Gain direct access and connections to people who have accomplished what others are only ‘talking’ about.`,
    },
    {
      text: `Our members are celebrities, millionaires, and social media icons who are ready to pass the torch of knowledge so that you too - may create a life of abundance and security that few can only imagine.`,
    },
  ];

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintDone, setMintDone] = useState(false);
  const [supply, setTotalSupply] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [statusAlert, setStatusAlert] = useState("");
  const [mintAmount, setMintAmount] = useState(0);
  const [displayCost, setDisplayCost] = useState(0);
  const [state, setState] = useState(1);
  const [nftCost, setNftCost] = useState(2.0);
  const [canMintWL, setCanMintWL] = useState(false);
  const [disable, setDisable] = useState(false);
  const [max, setMax] = useState(1);
  const [count, setCount] = React.useState(2);
  const [loading, setLoading] = useState(true);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 10,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = nftCost;
    cost = Web3.utils.toWei(String(cost), "ether");

    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}`);
    setClaimingNft(true);
    setLoading(true);
    // setDisable(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
        setLoading(false);
      })
      .then((receipt) => {
        setLoading(false);
        setMintDone(true);
        setFeedback(`Congratulation, your mint is successful.`);
        setClaimingNft(false);
        blockchain.smartContract.methods
          .totalSupply()
          .call()
          .then((res) => {
            setTotalSupply(res);
          });

        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 0;
    }
    setMintAmount(newMintAmount);
    setDisplayCost(parseFloat(nftCost * newMintAmount).toFixed(2));
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    newMintAmount > max ? (newMintAmount = max) : newMintAmount;
    setDisplayCost(parseFloat(nftCost * newMintAmount).toFixed(2));
    setMintAmount(newMintAmount);
  };

  const maxNfts = () => {
    setMintAmount(max);
    setDisplayCost(parseFloat(nftCost * max).toFixed(2));
  };

  const getData = async () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      const totalSupply = await blockchain.smartContract.methods
        .totalSupply()
        .call();
      setTotalSupply(totalSupply);
      let currentState = await blockchain.smartContract.methods
        .currentState()
        .call();
      setState(currentState);
    }
  };

  const getDataWithAlchemy = async () => {
    const web3 = createAlchemyWeb3(
      "https://polygon-mumbai.g.alchemy.com/v2/tAaDBP--_Zf2g2FPCYBhKhs6tlOXeu4W"
    );
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    var contract = new Contract(
      abi,
      "0x4231f82188b501e44127eba89fe8834182b53197"
    );
    contract.setProvider(web3.currentProvider);
    // Get Total Supply
    const totalSupply = await contract.methods.totalSupply().call();
    setTotalSupply(totalSupply);

    // Get Contract State
    let currentState = await contract.methods.currentState().call();
    setState(currentState);
    console.log(currentState);

    // Set Price and Max According to State

    if (currentState == 0) {
      setStatusAlert("MINT NOT LIVE YET!");
      setDisable(true);
      setDisplayCost(0.0);
      setMax(0);
      // } else if (currentState == 1) {
      //   let wlCost = await contract.methods.costWL().call();
      //   setDisplayCost(web3.utils.fromWei(wlCost));
      //   setNftCost(web3.utils.fromWei(wlCost));
      //   setStatusAlert("WHITELIST IS NOW LIVE!");
      //   setFeedback("Are you Whitelisted Member?");

      //   let wlMax = await contract.methods.maxMintAmountWL().call();
      //   setMax(wlMax);
    } else {
      let puCost = await contract.methods.cost().call();
      setDisplayCost(web3.utils.fromWei(puCost));
      setNftCost(web3.utils.fromWei(puCost));
      setStatusAlert("Public Mint is Live");
      let puMax = await contract.methods.maxMintAmountPublic().call();
      setMax(10);
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
    getDataWithAlchemy();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <>
      {loading && <Loader />}
      <NavbarPrimary />

      <span className="block md:hidden absolute top-0">
        <img
          className="block h-full w-full"
          src="/assets/images/bg-red.svg"
          alt="..."
        />
      </span>
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 pb-2">
        <div className="text-center uppercase text-2xl md:text-3xl lg:text-4xl font-bold font-titleBold">
          <span className="text-blue-300">MASTERMIND</span>{" "}
          <span className="text-red-400">NFT</span>
        </div>
      </section>
      <div className=" bbsw2"></div>

      <section
        className="relative bg-no-repeat bg-bottom bg-heroD"
        style={{ backgroundSize: "100% 54%" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full py-10 md:py-8 relative">
          <div className="grid grid-cols-3 gap-8 h-full">
            {/* lists */}
            <div className="md:hidden col-span-3 text-center">
              <ul className="space-y-3">
                {list.map((item) => (
                  <li
                    key={item.text}
                    className="flex items-baseline text-white"
                  >
                    <span className="text-[1.1rem] leading-6">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-3 lg:col-span-1">
              <div className="bg-GPrimary p-8 rounded-2xl">
                <ul className="space-y-6">
                  <li>
                    <div className="mb-4 capitalize font-semibold text-3xl text-center text-white border-2 border-indigo-600">
                      Mint NFT
                    </div>
                  </li>
                  <li className="bbw pb-4">
                    <div className="flex justify-between text-white">
                      <div className="text-lg font-semibold text-white">
                        Balance
                      </div>
                      <div>
                        {CONFIG.MAX_SUPPLY - supply} / {CONFIG.MAX_SUPPLY}
                      </div>
                    </div>
                  </li>
                  <li className="bbw pb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-white">
                        Amount
                      </div>
                      <div>
                        <div className="flex items-center gap-6">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                            type="button"
                            className="transition-all duration-200 transform active:scale-105 text-white"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="text-[1.25rem] font-semibold text-white">
                            {mintAmount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                            type="button"
                            className="transition-all duration-200 transform active:scale-105 text-white"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            maxNfts();
                          }}
                          type="button"
                          className=" bg-white text-black transition-all duration-200 transform active:scale-105 font-semibold p-2 rounded-lg"
                        >
                          Max
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="bbw pb-4">
                    <div className="flex justify-between text-white">
                      <div className="text-lg font-semibold text-white">
                        Total
                      </div>
                      <div>{displayCost}</div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connectWallet());
                          getData();
                        }}
                        type="button"
                        className="px-btn py-2 shadow-sm rounded-lg text-[1rem] bg-gradient-to-r from-secondary to-primary text-white hover:text-white focus:outline-none transition duration-200 transform hover:scale-105 w-full font-semibold"
                      >
                        Connect Wallet
                      </button>
                      <i className="px-btn text-[0.7rem] text-center block mt-2 text-white italic">
                        Make sure your MetaMask wallet is connected
                      </i>
                    </div>
                    <div className="bbsw" />
                    <h4 className="px-btn text-[0.75rem] sm:text-[0.9rem] font-semibold text-center mb-2 text-white	">
                      New to NFT space? no worries we got you!
                    </h4>
                    <div>
                      <button
                        type="button"
                        className="px-btn  py-2 shadow-sm rounded-lg text-[1rem] bg-gradient-to-r from-secondary to-primary text-white hover:text-white focus:outline-none transition duration-200 transform hover:scale-105 w-full font-semibold"
                      >
                        Get Your NFT with Card
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-span-3 lg:col-span-2 relative">
              <div>
                {/* lists */}
                <div className="hidden md:block">
                  <ul className="space-y-3">
                    {list.map((item) => (
                      <li key={item.text} className="flex items-baseline">
                        <span className="block w-4 min-w-[1.1rem] h-4 mr-2">
                          <img
                            className="block h-full w-full"
                            src="/assets/images/icon-0.svg"
                            alt="..."
                          />
                        </span>
                        <span className="text-[0.8rem] text-white leading-5">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* videos-cards */}
                <div className="text-center mt-14">
                  <div className="w-[100%] md:w-[45%] mx-auto relative">
                    <span className="absolute top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%] shadow-bg-primary" />
                    <img
                      className="block h-full w-full relative"
                      src="/assets/videos/card-video-unscreen.gif"
                      alt=".."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
