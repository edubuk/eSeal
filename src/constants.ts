import { BrowserWalletConnector, ephemeralConnectorType, WalletConnectConnector } from "@concordium/react-components";
import { SignClientTypes } from '@walletconnect/types';

export const E_SEALING_CONTRACT_NAME = "edubuleseal_testnet";

export const E_SEALING_CONTRACT_INDEX = 6310n;

export const E_SEALING_RAW_SCHEMA = '//8DAQAAAAsAAABFZHVidWtlU2VhbAACAAAABwAAAGdldEZpbGUGHiAAAAAVAgAAAAQAAABOb25lAgQAAABTb21lAQEAAAAUAAIAAAAJAAAAdGltZXN0YW1wDQcAAAB3aXRuZXNzCxUFAAAACwAAAFBhcnNlUGFyYW1zAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCCwAAAE9ubHlBY2NvdW50AhEAAABBbHJlYWR5UmVnaXN0ZXJlZAIMAAAAcmVnaXN0ZXJGaWxlBB4gAAAAFQUAAAALAAAAUGFyc2VQYXJhbXMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAILAAAAT25seUFjY291bnQCEQAAAEFscmVhZHlSZWdpc3RlcmVkAgEVAQAAAAwAAABSZWdpc3RyYXRpb24BAQAAABQAAwAAAAkAAABmaWxlX2hhc2geIAAAAAcAAAB3aXRuZXNzCwkAAAB0aW1lc3RhbXAN';

export const CONTRACT_SUB_INDEX = 0n;

const WALLET_CONNECT_PROJECT_ID = '76324905a70fe5c388bab46d3e0564dc';

const WALLET_CONNECT_OPTS: SignClientTypes.Options = {
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: 'edubukeseal_testnet',
    description: 'Edubuk eSeal dApp',
    url: '#',
    icons: ['https://walletconnect.com/walletconnect-logo.png'],
  },
};

export const BROWSER_WALLET = ephemeralConnectorType(BrowserWalletConnector.create);

export const WALLET_CONNECT = ephemeralConnectorType(
  WalletConnectConnector.create.bind(undefined, WALLET_CONNECT_OPTS)
);


