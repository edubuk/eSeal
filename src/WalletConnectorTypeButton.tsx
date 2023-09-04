import React, { useCallback } from 'react';
import {
ConnectorType,
useWalletConnectorSelector,
WalletConnection,
WalletConnectionProps,
} from '@concordium/react-components';

function connectorTypeStyle(baseStyle: any, isSelected: boolean, isConnected: boolean) {
  const style = { ...baseStyle, width: '50%' };

  if (isConnected) {
    style.backgroundColor = '#7303fc';
    // style.border = '1px solid #';
  } else if (isSelected) {
    style.backgroundColor = '#7303fc';
    // style.border = '#5c02c9';
  }

  return style;
}

interface Props extends WalletConnectionProps {
  buttonStyle: any;
  disabledButtonStyle: any;
  connectorType: ConnectorType;
  connectorName: string;
  setWaitingForUser: (v: boolean) => void;
  connection: WalletConnection | undefined;
}

export function WalletConnectionTypeButton(props: Props) {
  const { buttonStyle, disabledButtonStyle, connectorType, connectorName, setWaitingForUser, connection } = props;

  const { isSelected, isConnected, isDisabled, select } = useWalletConnectorSelector(
    connectorType,
    connection,
    props,
  );

  const onClick = useCallback(() => {
    setWaitingForUser(false);
    select();
  }, [select]);

  return (
    
    <button
      style={connectorTypeStyle(isDisabled ? disabledButtonStyle : buttonStyle, isSelected, isConnected)}
      disabled={isDisabled}
      type="button"
      onClick={onClick}
    >
      { isConnected ? `Disconnect ${connectorName}` : `Use ${connectorName}` }
    </button>
  )
}

