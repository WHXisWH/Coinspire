'use client';

import { ConnectKitButton } from 'connectkit';

export function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address, ensName }) => {
        return (
          <button
            onClick={show}
            className={`px-4 py-2 rounded-md font-medium ${
              isConnected
                ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isConnecting ? (
              '接続中...'
            ) : isConnected ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {ensName || `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
              </span>
            ) : (
              'ウォレットを接続'
            )}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
