import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import abi from "./item.json";
import abi2 from "./abi.json";

function App() {
	const web3 = new Web3(window.ethereum);
	const addr = "0x442Cd5b268F536527a99fd7c7cD789c191649E04";
	const contract = new web3.eth.Contract(abi, addr);

	const addr2 = "0x3981334f09c99b5523adb5fd3dd0a4d45bc10e06";
	const contract2 = new web3.eth.Contract(abi2, addr2);

	console.log(contract2.methods, 2);

	const [account, setAccount] = useState("");
	const [balance, setBalance] = useState("");
	const [tokenBalance, setTokenBalance] = useState("");

	const connect = async () => {
		if (window.ethereum) {
			try {
				const res = await window.ethereum.request({ method: "eth_requestAccounts" });
				setAccount(res[0]);
				const balance = await window.ethereum.request({ method: "eth_getBalance", params: [res[0].toString(), "latest"] });
				setBalance(ethers.utils.formatEther(balance));
				const tokenBal = await contract2.methods.balanceOf(res[0]).call();
				setTokenBalance(tokenBal);
			} catch (err) {
				console.log(err);
			}
		} else {
			alert("메타마스크를 깔아");
		}
	};

	const plus = async () => {
		await contract.methods.add().send({ from: account });
	};
	const minus = () => {};

	const get = async () => {
		const res = await contract.methods.getState().call();
		console.log(res);
	};

	const sendTx = async (e) => {
		e.preventDefault();

		const data = new FormData(e.target);

		const params = {
			from: account,
			to: data.get("address"),
			value: data.get("amount"),
		};
		await web3.eth.sendTransaction(params);
	};

	const sendToken = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);

		const res = await contract2.methods.transfer(data.get("address"), data.get("amount")).send({ from: account });
		console.log(res);
	};

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", connect);
			window.ethereum.on("chainChanged", connect);
		}
	}, []);
	return (
		<div>
			<div>연결된 주소{account}</div>
			<div>내 이더{balance}</div>
			<div>내20토큰 {tokenBalance}</div>
			<button onClick={() => connect()}>연결하기</button>

			<button onClick={plus}>플러스</button>
			<button onClick={minus}>마이너스</button>
			<button onClick={get}>가져와</button>
			<div>
				<div>eth 보내기</div>
				<form onSubmit={sendTx}>
					<input type="text" name="address" placeholder=" 주소를 넣거라~" />
					<input type="text" name="amount" placeholder=" 수량을 넣거라~" />
					<button type="submit">send</button>
				</form>
				<div>20토큰보내기</div>
				<form onSubmit={sendToken}>
					<input type="text" name="address" placeholder=" 주소를 넣거라~" />
					<input type="text" name="amount" placeholder=" 수량을 넣거라~" />
					<button type="submit">send</button>
				</form>
			</div>
		</div>
	);
}

export default App;
