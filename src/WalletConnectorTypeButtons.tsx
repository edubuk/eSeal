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
    style.backgroundColor = '#c2259a';
    style.border = '1px solid #69024f';
  } else if (isSelected) {
    style.backgroundColor = '#69024f';
    style.border = '#38012a';
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

