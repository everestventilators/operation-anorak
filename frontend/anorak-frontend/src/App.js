// src/App.js

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import ChatBot from 'react-simple-chatbot';
import '@solana/wallet-adapter-react-ui/styles.css'; // Wallet adapter styles

function App() {
  const network = 'devnet'; // Use 'mainnet-beta' for production

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Content />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function Content() {
  const wallet = useWallet();
const [hasAccess, setHasAccess] = useState(true); // or false, depending on your needs


  const handleSendTokens = useCallback(async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet!');
      return;
    }

    try {
      // Create a connection to the Solana network
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      // Define transaction parameters
      const recipientPublicKey = new PublicKey('YourRecipientWalletAddress'); // Replace with your recipient wallet address
      const amount = 0.01 * 1e9; // Amount in lamports (0.01 SOL)

      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPublicKey,
          lamports: amount,
        })
      );

      // Send the transaction
      const signature = await wallet.sendTransaction(transaction, connection);

      // Confirm the transaction
      await connection.confirmTransaction(signature, 'processed');

      // Update access status
      setHasAccess(true);
      alert('Tokens sent successfully! You now have access to the chat.');
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending tokens.');
    }
  }, [wallet]);

  const handleEnd = ({ steps, values }) => {
    console.log('Chat ended with steps:', steps);
    console.log('Chat ended with values:', values);
  };

  const steps = [
    {
      id: '1',
      message: 'Welcome to Operation Anorak!',
      trigger: '2',
    },
    {
      id: '2',
      message: 'How can I assist you today?',
      end: true,
    },
  ];

  return (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Operation Anorak</h1>
    <div style={{ marginTop: '20px' }}>
      <ChatBot steps={steps} />
    </div>
  </div>
	);
}

export default App;
