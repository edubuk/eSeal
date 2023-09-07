import './App.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import {
  toBuffer,
  deserializeReceiveReturnValue,
  serializeUpdateContractParameters,
  ConcordiumGRPCClient,
} from '@concordium/web-sdk';
import sha256 from 'sha256';
import { useGrpcClient, TESTNET, WalletConnectionProps, useConnection, useConnect } from '@concordium/react-components';
// import { version } from '../package.json';
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
  // width: "100%",
  backgroundColor: "#7303fc",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

const ButtonStyleDisabled = {
  color: "white",
  borderRadius: "8px",
  // width: "100%",
  backgroundColor: "#7303fc",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

const ButtonStyleSelected = {
  color: "white",
  borderRadius: "8px",
  // width: "100%",
  backgroundColor: "#7303fc",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

const ButtonStyleNotSelected = {
  color: "white",
  borderRadius: "8px",
  // width: "100%",
  backgroundColor: "#7303fc",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

const InputFieldStyle = {
  backgroundColor: "#7303fc",
  color: "white",
  borderRadius: "8px",
  // width: "100%",
  margin: "7px 0px 7px 0px",
  padding: "0.4em",
  fontWeight: "600",
  fontSize: "1em",
};

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

  useEffect(() => {
    // View File Record
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

  const [isRegisterFilePage, setIsRegisterFilePage] = useState(true);

  const [hash, setHash] = useState('');
  
  const [transactionError, setTransactionError] = useState('');

  const [loadingError, setLoadingError] = useState('');

  const file = useRef<HTMLInputElement | null>(null);

  const [isWaitingForTransaction, setWaitingForUser] = useState(false);

  return (
    <div className="container hero" id="sealer" style={{paddingTop: "25vh", paddingBottom: "25vh", maxWidth: "340px"}}>
      <div style={{border: "3px solid #ff80dfff", borderRadius: "8px", maxWidth: "340px"}}>
        {/* <h1 className="header">Register a file on Concordium</h1> */}
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
        <div className="container">
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
              <div style={{fontSize: "1.4em", padding: "0em 1em 1em 0em"}}>Connected to:</div>
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
              <div className="containerSpaceBetween" style={{paddingTop: "1em"}}>
                  <button
                      style={!isRegisterFilePage ? ButtonStyleNotSelected : ButtonStyleSelected}
                      type="button"
                      onClick={() => {
                          setIsRegisterFilePage(true);
                          setFileHashHex('');
                          setWitness('');
                          setTimestamp('');
                          setHash('');
                      }}
                  >
                      Register
                  </button>
                  <Switch
                      onChange={() => {
                          setIsRegisterFilePage(!isRegisterFilePage);
                          setFileHashHex('');
                          setWitness('');
                          setTimestamp('');
                          setHash('');
                      }}
                      onColor="#7303fc"
                      offColor="#a606ff"
                      onHandleColor="#ff80df"
                      offHandleColor="#ff80df"
                      checked={!isRegisterFilePage}
                      checkedIcon={false}
                      uncheckedIcon={false}
                  />
                  <button
                      style={isRegisterFilePage ? ButtonStyleNotSelected : ButtonStyleSelected}
                      type="button"
                      onClick={() => {
                          setIsRegisterFilePage(false);
                          setFileHashHex('');
                          setWitness('');
                          setTimestamp('');
                          setHash('');
                      }}
                  >
                      Display
                  </button>
              </div>
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
          <div className="container" style={{display: "flex", flexDirection: "column"}}>
            {/* <label> */}
                <p style={{ marginBottom: 0, padding: "0em 0em 1em 0em", color: "#7303fc" }}>Select a file:</p>
                <input
                    className="input"
                    style={InputFieldStyle}
                    type="file"
                    onChange={changeHandler}
                    ref={file}
                />
            {/* </label> */}
            <div style={{paddingTop: "2vh"}}>
            <button
              style={ButtonStyle}
              type="button"
              onClick={async () => {
                try {
                  if (selectedFile !== undefined) {
                    setFileHashHex('');
                    setLoading(true);
                    const arrayBuffer = await selectedFile.arrayBuffer();
                    const byteArray = new Uint8Array(arrayBuffer as ArrayBuffer);
                    const newFileHashHex = sha256(byteArray.toString());
                    setFileHashHex(newFileHashHex);
                    setLoadingError('');
                    setLoading(false);
                  } else {
                    // eslint-disable-next-line no-alert
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
            <p style={{ marginBottom: 0, color: "#7303fc", paddingTop: "2vh", paddingBottom: "1vh" }}>File hash of selected file:</p>
            {loadingError && <div style={{ color: 'red' }}>Error: {loadingError}.</div>}
            {isLoading && <div className="loadingText">Loading...</div>}
            {fileHashHex !== '' && <div className="loadingText" style={{wordWrap: "break-word", background: "#7303fc", color: "white", padding: "0.4em", borderRadius: "8px", lineHeight: "1.3em"}}>0x{fileHashHex}</div>}
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
          <div className="container">
            <button
                style={fileHashHex === '' ? ButtonStyleDisabled : ButtonStyle}
                type="button"
                disabled={fileHashHex === ''}
                onClick={() => {
                    if (witness !== null) {
                        // eslint-disable-next-line no-alert
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
                }}
            >
                Register File Hash
            </button>
          </div>
        )}
        {connection && account && (
            <p>
                {isRegisterFilePage && (
                    <div className="container">
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
