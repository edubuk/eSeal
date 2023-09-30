import './App.css';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  toBuffer,
  deserializeReceiveReturnValue,
  serializeUpdateContractParameters,
  ConcordiumGRPCClient,
} from '@concordium/web-sdk';
import sha256 from 'sha256';
import { useGrpcClient, TESTNET, WalletConnectionProps, useConnection, useConnect } from '@concordium/react-components';
import { register } from './utils';
import {
  E_SEALING_CONTRACT_NAME,
  E_SEALING_CONTRACT_INDEX,
  E_SEALING_RAW_SCHEMA,
  CONTRACT_SUB_INDEX,
  BROWSER_WALLET,
  WALLET_CONNECT,
} from './constants'
import { WalletConnectionTypeButton } from './WalletConnectorTypeButton';

const ButtonStyle = {
  color: "white",
  borderRadius: "8px",
  backgroundColor: "#7303fc",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

const ButtonStyleDisabled = {
  color: "white",
  borderRadius: "8px",
  backgroundColor: "#7303fc",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

const ButtonStyleSelected = {
  color: "black",
  borderRadius: "8px",
  backgroundColor: "#ff80df",
  fontWeight: "600",
  fontSize: "1.2rem",
};

const InputFieldStyle = {
  backgroundColor: "#7303fc",
  color: "white",
  borderRadius: "8px",
  margin: "7px 0px 7px 0px",
  padding: "0.4em",
  fontWeight: "600",
  fontSize: "1em",
};

const Disabled = {
  display: "none"
};

const Enabled = {};

async function postEseal(filehash: string, issuedTo: string, issuedBy: string, cerType: string, hash: string, timestamp: string, signer: string) {
  await fetch("https://edubukeseal.xyz/eseal", {
    method: 'POST',
    body: JSON.stringify([filehash, issuedTo, issuedBy, cerType, hash, timestamp, signer])
  }).then((res) => console.log(res));
}

async function viewFile(rpcClient: ConcordiumGRPCClient, fileHashHex: string) {
    const param = serializeUpdateContractParameters(
        E_SEALING_CONTRACT_NAME,
        'getFile',
        fileHashHex,
        toBuffer(E_SEALING_RAW_SCHEMA, 'base64')
    );

    const res = await rpcClient.invokeContract({
        method: `${E_SEALING_CONTRACT_NAME}.getFile`,
        contract: { index: E_SEALING_CONTRACT_INDEX, subindex: CONTRACT_SUB_INDEX },
        parameter: param,
    });

    if (!res || res.tag === 'failure' || !res.returnValue) {
        throw new Error(
            `RPC call 'invokeContract' on method '${E_SEALING_CONTRACT_NAME}.view' of contract '${E_SEALING_CONTRACT_INDEX}' failed`
        );
    }

    const returnValues = deserializeReceiveReturnValue(
        toBuffer(res.returnValue, 'hex'),
        toBuffer(E_SEALING_RAW_SCHEMA, 'base64'),
        E_SEALING_CONTRACT_NAME,
        'getFile',
        2
    );

    if (returnValues.Some !== undefined) {
        return returnValues.Some[0];
    }
    return { timestamp: null, witness: null };
}

export function Sealer(props: WalletConnectionProps) {
  const { network, activeConnectorType, activeConnector, activeConnectorError, connectedAccounts, genesisHashes } = props;

  const { connection, setConnection, account, genesisHash } = useConnection(connectedAccounts, genesisHashes);

  const { connect, isConnecting, connectError } = useConnect(activeConnector, setConnection);

  const grpcClient = useGrpcClient(TESTNET);

  const [isLoading, setLoading] = useState(false);

  const [getFileError, setGetFileError] = useState('');

  const [fileHashHex, setFileHashHex] = useState('');

  const [issuedTo, setIssuedTo] = useState('');

  const [issuedBy, setIssuedBy] = useState('');

  const [cerType, setCerType] = useState('');

  const [selectedFile, setSelectedFile] = useState<File>();

  const [witness, setWitness] = useState('');

  const [timestamp, setTimestamp] = useState('');
  
  const changeHandler = (event: ChangeEvent) => {
    const test = event.target as HTMLInputElement;

    if (test.files) {
      const file = test.files[0];
      setSelectedFile(file);
    }
  };

  const issuedToChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setIssuedTo(name);
  }

  const issuedByChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const authority = event.target.value;
    setIssuedBy(authority);
  }

  const cerTypeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cert_type = event.target.value;
    setCerType(cert_type);
  }

  useEffect(() => {
    if (grpcClient && fileHashHex !== '') {
      viewFile(grpcClient, fileHashHex)
        .then((record) => {
          setGetFileError('');
          setTimestamp(record.timestamp);
          setWitness(record.witness);
        })
        .catch((e) => {
          setGetFileError((e as Error).message);
          setTimestamp('');
          setWitness('');
        });
    }
  }, [grpcClient, fileHashHex]);

  useEffect(() => {
    if (fileHashHex !== '' && hash !== '' && witness !== '' && timestamp !== '' && issuedTo !== '' && issuedBy !== '' && cerType !== '') {
      postEseal(fileHashHex, issuedTo, issuedBy, cerType, hash, timestamp, witness).catch((e) => console.log(e));
    }
  })

  const [isRegisterFilePage, setIsRegisterFilePage] = useState(true);

  const [hash, setHash] = useState('');
  
  const [transactionError, setTransactionError] = useState('');

  const [loadingError, setLoadingError] = useState('');

  const file = useRef<HTMLInputElement | null>(null);

  const name = useRef<HTMLInputElement | null>(null);

  const authority = useRef<HTMLInputElement | null>(null);

  const cert_type = useRef<HTMLInputElement | null>(null);

  const [isWaitingForTransaction, setWaitingForUser] = useState(false);

  return (
    <div className="container hero" id="sealer" style={{paddingTop: "25vh", paddingBottom: "25vh", maxWidth: "340px"}}>
      <div style={{border: "3px solid #ff80dfff", borderRadius: "8px", maxWidth: "340px"}}>
        <div className="container"><button style={ButtonStyleSelected}>eSeal Your Certificate</button></div>
        <div className="container" style={{display: "flex", flexDirection: "row", justifyContent: "space-between", columnGap: "20px"}}>
          <WalletConnectionTypeButton
            buttonStyle={ButtonStyle}
            disabledButtonStyle={ButtonStyleDisabled}
            connectorType={BROWSER_WALLET}
            connectorName="Browser Wallet"
            setWaitingForUser={setWaitingForUser}
            connection={connection}
            {...props}
          />
          <WalletConnectionTypeButton
            buttonStyle={ButtonStyle}
            disabledButtonStyle={ButtonStyleDisabled}
            connectorType={WALLET_CONNECT}
            connectorName="Wallet Connect"
            setWaitingForUser={setWaitingForUser}
            connection={connection}
            {...props}
          />
        </div>
        <div className="container" style={{paddingTop: "0em"}}>
          {activeConnectorError && <p style={{ color: 'red' }}>Connector Error: {activeConnectorError}.</p>}
          {!activeConnectorError && !isWaitingForTransaction && activeConnectorType && !activeConnector && (
              <p>
                  <i>Loading connector...</i>
              </p>
          )}
          {connectError && <p style={{ color: 'red' }}>Connect Error: {connectError}.</p>}
          {!connection && !isWaitingForTransaction && activeConnectorType && activeConnector && (
              <p>
                  <button style={ButtonStyle} type="button" onClick={connect}>
                      {isConnecting && 'Connecting...'}
                      {!isConnecting && activeConnectorType === BROWSER_WALLET && 'Connect Browser Wallet'}
                      {!isConnecting && activeConnectorType === WALLET_CONNECT && 'Connect Mobile Wallet'}
                  </button>
              </p>
          )}
          {account && (
            <>
              <div style={{fontSize: "1.2em", padding: "0em 0.5em 0.5em 0em"}}>Connected to:</div>
              <button
                style={{background: "#7303fc", wordWrap: "break-word"}}
                  className="link"
                  type="button"
                  onClick={() => {
                      window.open(
                          `https://testnet.ccdscan.io/?dcount=1&dentity=account&daddress=${account}`,
                          '_blank',
                          'noopener,noreferrer'
                      );
                  }}
              >
                  {account}
              </button>
            </>
          )}
          {genesisHash && genesisHash !== network.genesisHash && (
              <p style={{ color: 'red' }}>
                  Unexpected genesis hash: Please ensure that your wallet is connected to network{' '}
                  <code>{network.name}</code>.
              </p>
          )}
        </div>
        {account !== undefined && (
          <div className="container" style={{display: "flex", flexDirection: "column", paddingTop: "0em"}}>
            <p style={{ marginBottom: 0, padding: "0em 0em 0em 0em", color: "#7303fc" }}>Certificate Issued To:</p>
            <input 
              className="textinputfield" 
              type="text" 
              onChange={issuedToChangeHandler}
              ref={name}
            />
            <p style={{ marginBottom: 0, padding: "0.5em 0em 0em 0em", color: "#7303fc" }}>Certificate Issued By:</p>
            <input
              className="textinputfield" 
              type="text" 
              onChange={issuedByChangeHandler}
              ref={authority}
            />
            <p style={{ marginBottom: 0, padding: "0.5em 0em 0em 0em", color: "#7303fc" }}>Certificate Type:</p>
            <input 
              className="textinputfield" 
              type="text" 
              onChange={cerTypeChangeHandler}
              ref={cert_type}
            />
            <p style={{ marginBottom: 0, padding: "0.5em 0em 0.5em 0em", color: "#7303fc" }}>Select a file:</p>
            <input
                className="input"
                style={InputFieldStyle}
                type="file"
                onChange={changeHandler}
                ref={file}
            />
            <div style={{paddingTop: "0.5em"}}>
            <button
              style={ButtonStyle}
              type="button"
              onClick={async () => {
                try {
                  if (issuedTo === '') {
                      alert('Please insert your name in "Certificate Issued To" field');
                    } else if (issuedBy === '') {
                      alert('Please insert the name of the Certifying Authority in "Certificate Issued By" field');
                    } else if (cerType === '') {
                      alert('Please insert the "Certificate Type"');
                    } else if (selectedFile !== undefined) {
                    setFileHashHex('');
                    setLoading(true);
                    const arrayBuffer = await selectedFile.arrayBuffer();
                    const byteArray = new Uint8Array(arrayBuffer as ArrayBuffer);
                    const newFileHashHex = sha256(byteArray.toString());
                    setFileHashHex(newFileHashHex);
                    setHash('');
                    setLoadingError('');
                    setLoading(false);
                  } else {
                    alert('Choose a file to compute the file hash');
                  }
                } catch (err) {
                  setLoadingError((err as Error).message);
                }
            }}
            >
              Compute File Hash
            </button>
            </div>
            <div style={fileHashHex === '' ? Disabled : Enabled}>
              <p style={{ marginBottom: 0, color: "#7303fc", paddingTop: "0.5em", paddingBottom: "0.25em" }}>File hash of selected certificate:</p>
              {loadingError && <div style={{ color: 'red' }}>Error: {loadingError}.</div>}
              {isLoading && <div className="loadingText">Loading...</div>}
              {fileHashHex !== '' && <div className="loadingText" style={{wordWrap: "break-word", background: "#7303fc", color: "white", padding: "0.4em", borderRadius: "8px", lineHeight: "1.3em"}}>0x{fileHashHex}</div>}
              </div>
          </div>
        )}
        {!connection && (
          <div className='container'>
            <button style={ButtonStyleDisabled} type="button" disabled>
                Waiting for connection...
            </button>
          </div>
        )}
        {connection && isRegisterFilePage && account && (
          <div className="container" style={fileHashHex === '' ? Disabled : Enabled}>
            <button
                style={fileHashHex === '' ? ButtonStyleDisabled : ButtonStyle}
                type="button"
                disabled={fileHashHex === ''}
                onClick={() => {
                if (issuedTo === undefined) {
                  alert(`Please enter name of the Certificate Beneficiary`)
                } else if (issuedBy === undefined) {
                  alert(`Please specify the Certifying Authority`)
                } else if (cerType === undefined) {
                  alert(`Please mention Certificate Type (Graduation, Postgraduation, etc.)`)
                } else if (fileHashHex === '') {
                  alert(`Select a file and Compute file hash to register`)
                } else {                   
                  if (witness !== null) {
                        alert(
                            `This file hash is already registered \n${witness} (withness) \n${timestamp} (timestamp)`
                        );
                    } else {
                        setHash('');
                        setTransactionError('');
                        setWaitingForUser(true);
                        const tx = (isRegisterFilePage ? register : register)(
                            connection,
                            account,
                            fileHashHex,
                            E_SEALING_CONTRACT_INDEX,
                            CONTRACT_SUB_INDEX
                        );
                        tx.then(setHash)
                            .catch((err) => setTransactionError((err as Error).message))
                            .finally(() => setWaitingForUser(false));
                    }
                }
                }}
            >
                Register File Hash
            </button>
          </div>
        )}
        {connection && account && fileHashHex !== '' && (
            <p>
                {isRegisterFilePage && (
                    <div className="container" style={{paddingTop: "0em"}}>
                        <div style={{color: "#7303fc", paddingBottom: "0.4em"}}>Transaction status{hash === '' ? '' : ''}</div>
                        {!hash && transactionError && (
                            <div style={{ color: 'red' }}>Error: {transactionError}.</div>
                        )}
                        {!hash && !transactionError && <div className="loadingText">None</div>}
                        {hash && (
                            <>
                                <button
                                  style={{background: "#7303fc", wordWrap: "break-word"}}
                                    className="link"
                                    type="button"
                                    onClick={() => {
                                        window.open(
                                            `https://testnet.ccdscan.io/?dcount=1&dentity=transaction&dhash=${hash}`,
                                            '_blank',
                                            'noopener,noreferrer'
                                        );
                                    }}
                                >
                                    {hash}
                                </button>
                            </>
                        )}
                    </div>
                )}
                {getFileError && <div style={{ color: 'red' }}>Error: {getFileError}.</div>}
                {!isRegisterFilePage && witness !== '' && (
                    <div style={{color: "#7303fc"}} className="container">
                        <div style={{paddingBottom: "0.4em"}}>On-chain Record:</div>
                        <div className="loadingText" style={{wordWrap: "break-word", padding: "0.4em", borderRadius: "8px", background: "#7303fc", color: "white"}}>{witness === null ? 'Not registered' : witness} (witness)</div>
                        <div className="loadingText" style={{paddingTop: "0.4em", wordWrap: "break-word"}}>
                            {timestamp === null ? 'Not registered' : timestamp} (timestamp)
                        </div>
                    </div>
                )}
            </p>
        )}
        </div>
      </div>
  )
}
