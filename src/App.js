import {useState} from "react";
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { verifyProof } from "@semaphore-protocol/proof"
import { packToSolidityProof } from "@semaphore-protocol/proof"

import { ethers } from "ethers";
// import * as fs from 'fs';



export default function Home() {
  const [identity,setIdentity] =useState("");
  const [trapdoor,setTrapdoor] =useState("");
  const [nullifier,setNullifier] =useState("");
  const [identityCommitment,setIdentityCommitment] =useState("");

  const [group1,setGroup1] =useState("");
  const [group2,setGroup2 ]=useState("");

  const [group1Proof,setGroup1Proof] =useState("");

  const [group1Status,setGroup1Status] =useState("");

  const [group1Verification,setGroup1Verification] =useState("");
  const [group1ExternalNullifier,setGroup1ExternalNullifier] = useState("");
  const [group1NullifierHash,setGroup1NullifierHash] = useState("");
  const [group1SolidityProof,setGroup1SolidityProof] = useState("");
  const [createGroupTx,setCreateGroupTx] = useState("");
  const [verifyOnChainTx,setVerifyOnChainTx] = useState("");






  const depth = 20;
  const admin = '0xd770134156f9aB742fDB4561A684187f733A9586';
  const signal = "Hello ZK";
  const signalBytes32 = ethers.utils.formatBytes32String(signal);
  const groupId = 7579;
  let zeroValue = 0;

  function generateNewId(){
    const newIdentity = new Identity()
    const newTrapdoor = newIdentity.getTrapdoor();
    const newNullifier = newIdentity.getNullifier();
    const newIdentityCommitment = newIdentity.generateCommitment();


    console.log(newIdentity);
    console.log(newTrapdoor);
    console.log(newNullifier);
    console.log(newIdentityCommitment);


    setIdentity(newIdentity);
    setTrapdoor(newTrapdoor);
    setNullifier(newNullifier);
    setIdentityCommitment(newIdentityCommitment);

  }
  function createNewGroup(){
    // Default parameters: treeDepth = 20, zeroValue = BigInt(0).

    const group = new Group();
    console.log(group)
    group.addMember(identityCommitment);
    setGroup1(group);
    setGroup1Status("Created!");
  }

  async function generateProofGroup1(){

    const externalNullifier = group1.root

    const fullProof = await generateProof(identity, group1, externalNullifier, signal, {
      zkeyFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.zkey",
      wasmFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.wasm"
    })

    // const { nullifierHash } = fullProof.publicSignals
    const solidityProof = packToSolidityProof(fullProof.proof)

    setGroup1Proof(fullProof);
    // setGroup1NullifierHash(nullifierHash);
    setGroup1SolidityProof(solidityProof);
    setGroup1ExternalNullifier(externalNullifier);
  }

  async function verifyProofGroup1(){
   
    const verificationKey = await fetch("http://localhost:3000/semaphore.json").then(function(res) {
      return res.json();
    });

    const res = await verifyProof(verificationKey, group1Proof) // true or false.
    const response = res.toString();
    setGroup1Verification(response);

    console.log(res);

  }



  return (
    <div>
      <h1>Hello Zk World!</h1>
      <button onClick={generateNewId}>1. Generate New Id</button>
      <h5>Trapdoor</h5> 
      <p>{trapdoor.toString()}</p>
      <h5>Nullifier</h5>
      <p>{nullifier.toString()}</p>
      <h5>Identity Commitment</h5>
      <p>{identityCommitment.toString()}</p>

      <h3>2. Create New Group</h3>
    
      <button onClick={createNewGroup}>Create New Group</button>

      <p>{group1Status}</p>

      <h3>3. Generate Proof for Group1</h3>

      <button onClick={generateProofGroup1}>Generate</button>
      <p>{JSON.stringify(group1Proof)}</p>


      
      <h3>5. Verify Proof Off Chain</h3>

      <button onClick={verifyProofGroup1}>Verify Membership Off Chain</button>
      <p>{group1Verification}</p>


    </div>
  )
}