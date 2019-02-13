import Web3 from 'web3';
import React from 'react';

import CONTRACT from '../assets/contract';
import ERC20s from '../assets/erc20s';
import ERC721s from '../assets/erc721s';

// async module.exports :
// https://duckduckgo.com/?q=module+export+asynchronous&ia=web
async function setupWeb3(_this) {
  if (typeof window.web3 !== 'undefined') {
    window.ethereum.enable();
    _this.setState({
      web3 : new Web3(window.web3.currentProvider),
    })
   } else {
     alert('Please use MetaMask!')
     // ganache whatever or force them to use metamask
   }
}

async function getWeb3() {
  if (typeof window.web3 !== 'undefined') {
    window.ethereum.enable();
    return new Web3(window.web3.currentProvider)
   } else {
     alert('Please use MetaMask!')
   }
}

async function getContract(_web3, abi, address) {
  // return new _web3.eth.Contract(abi, address);
  try {
    return new _web3.eth.Contract(abi, address);
  } catch (err) {
    console.log(err);
  }
}

/**
 * Test if we can get data from rinkeby crypto kittes
 */
async function getUserBalanceOfERC721(_web3){
  let web3 = await getWeb3();
  let questing = await getContract(web3, CONTRACT.Rinkeby.abi, CONTRACT.Rinkeby.address)
  let a1 = await web3.eth.getAccounts()[0];
  let balance = 0
  try {
    balance = await questing.methods.checkRequiremnetLockup('0x16baf0de678e52367adc69fd067e5edd1d33e3bf').call({from: a1})
  } catch(e){

  }
  return balance
}

/**
 * Check if user has a specifc token. 
 * 
 * Used in log screen to show if they have any of the requirements. 
 * Also used in create page to show which tokens they own and can 
 * use as a prize. 
 */
async function checkOwnership(_web3, tokenAddress, account, isNFT){
  
}



// async function getQuests(start, _limit, net, _web3) {
//   let output = []
// 	try {
//     let contract = await getContract(_web3, CONTRACT[net].abi, CONTRACT[net].address)
//     let totalQuests = await contract.questId.call((err, result) => { return result ? !err : err });
//     // let max = Math.min(_limit, _max)
//     let listedQuests = start;
//     let parsedQuests = start;
//     while (listedQuests < _limit && parsedQuests < totalQuests) {
//       let next = await getAQuest(c, net, _web3)
//       let open = await getQuestStatus(c, contract)
//       if (open) { output.push(next); listedQuests++ }
//       parsedQuests++;
//     }
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

// async function getQuestStatus(id, contract) {
//   try {
// 		let ans = await contract.questExists.call(id)
//     return ans;
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

// async function getAQuest(id, contract) {
//   let output = []
// 	try {
//     contract.QUESTS.call((id) => {
//       //output.push(result2);
//       output.push(id);
//       c++;
//     })
// 		return output;
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

// let getQuests = (net, _web3, start, _limit) => {
//   let output = []
//   let contract = getContract(_web3, CONTRACT[net].abi, CONTRACT[net].address)
//   let _max;
//   contract.questId.call((err, result) => {
//     if (!err) { _max = result }
//   });
//   let max = Math.min(_limit, _max)
//   let c = start;
//   while (c < max) {
//     contract.questExists.call(c, (err, result) => {
//       if (result) {
//         contract.QUESTS.call(c, (err2, result2) => {
//           output.push(result2);
//           c++;
//         })
//       }
//     })
//   }
// }

async function setupState(_this) {
  // Source: https://ethereum.stackexchange.com/questions/17207/how-to-detect-if-on-mainnet-or-testnet
  window.web3.version.getNetwork((err, networkId) => {
    let networkName;
    switch (networkId) {
      case "1":
        networkName = "Main";
        break;
      // case "2":
      //  networkName = "Morden";
      //  break;
      // case "3":
      //   networkName = "Ropsten";
      //   break;
      case "4":
        networkName = "Rinkeby";
        break;
      // case "42":
      //   networkName = "Kovan";
      //   break;
      default:
        networkName = "Unknown";
    }
    const net = networkName;
    const abi = CONTRACT[net].abi
    const address = CONTRACT[net].address
    if (net === "Unknown") {
      alert("Pursuit is only available on Rinkeby testnet or Mainnet!\nPlease switch networks and try again.");
      return;
    }
    let accounts = []
    _this.state.web3.eth.getAccounts().then(res => {
      accounts = res;
      _this.setState({
        contract: getContract(_this.state.web3, abi, address),
        net,
        account: accounts[0],
      })
    })
  })
}

export { setupWeb3, setupState, getUserBalanceOfERC721}


// // PASS THIS IN AS PROP IN LIEU OF WEB3PROVIDER ??
// let checkForMetaMask = (net) => {
//   if (net){
//     return (
//       <div className="container">
//       <div className="button" id="b1" onClick={"function"}>
//         <p>Click to increase balance</p>
//       </div>
//       <div className="button" id="b2" onClick={"function"}>
//         <p>Click to get balance</p>
//       </div>
//     </div>
//     )
//   } else {
//     return (
//       <div>
//         <p>Connect to metamask</p>
//       </div>
//     )
//   }
// }

let createQuest = (_this) => {
  this.state.contract.methods.createQuest(
    // address _prizeTokenAddress,
    // uint _prizeTokenId,
    // uint _prizeTokenAmount,
    // bool _prizeIsNFT,
    // address[] memory _requirementsList
   ).send({
    from : this.state.account
   }, function(err, res){
    alert('Error in creating the quest!');
  });
}

let cancelQuest = (_this) => {
  this.state.contract.methods.cancelQuest(
    // uint _questId
   ).send({
    from : this.state.account
   }, function(err, res){
    alert('Error in cancelling the quest!');
  });
}

let completeQuest = (_this) => {
  this.state.contract.methods.completeQuest(
    // uint _questId
    // uint[] memory _submittedTokenIds
   ).send({
    from : this.state.account
   }, function(err, res){
    alert('Error in completing the quest!');
  });
}

// let readQuest = (_this, qid) => {
//   // Source: https://www.reddit.com/r/ethdev/comments/6us20e/accessing_struct_value_inside_of_map_using_web3/
//   return this.state.contract.QUESTS(qid); // RETURNS AN ARRAY
// }
//
// let checkPrizeLockup = (_this, qid) => {
//   // Source: https://www.reddit.com/r/ethdev/comments/6us20e/accessing_struct_value_inside_of_map_using_web3/
//   return this.readQuest(qid)[1];
// }
// // let checkPrizeLockup = (_this, qid) => {
// //   this.state.contract.methods.checkPrizeLockup(qid).send({
// //      from : this.state.account
// //    }, function(err, res){
// //     alert('Error in checking the prize lockup of the quest!');
// //   });
// // }
//
// let cancelOrder = (_this, qid) => {
//   this.state.contract.methods.cancelOrder(qid).send({
//      from : this.state.account
//    }, function(err, res){
//     alert('Error in canceling the quest!');
//   });
// }



/// ///
/// ///


/*
* WE NEED TO STORE ABI FOR ALL SUPPORTED TOKENS
*
*/

/*
ALSO: Ian: we only accept or disburse 721s?
*/


let approvePursuit = (_state, tokenTicker, user, tokenId) => {
  let tokenContract = getContract(
    _state.web3,
    ERC721s[_state.net][tokenTicker].abi,
    ERC721s[_state.net][tokenTicker].address
  )
  tokenContract.methods.transferFrom(
    user,
    CONTRACT[_state.net].address,
    tokenId
   ).send({
    from: user
  }, function(err, res){
    alert('Error in fetching approval the for requisite token!');
  });
}

/*
control flow:
1. input text field with 'check' button
2. input text and click 'check' == approvePursuit()
3a. confirmation that we have ownership
3a4. tokenId replaced input text field, can click submit maybe
3a45. submit to transfer ownership, complete quest
3b. 'not yet approved, proceed with transaction? yes or no?'
3b4a. 'no'
3b4b. 'yes'
3b4b5. metamask tx / signature, await txhash
3b4b56. tokenId replaced input text field, can click submit maybe
3b4b567. submit to transfer ownership, complete quest
*/
