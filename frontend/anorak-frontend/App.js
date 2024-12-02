// src/App.js

import React, { useMemo, useState } from 'react';
import './App.css';

// Solana Wallet Adapter imports
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Chat imports
import { ChatFeed, Message } from 'react-chat-ui';
import axios from 'axios';

// Default styles
import '@solana/wallet-adapter-react-ui/styles.css';

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
  const [messages, setMessages] = useState([
    new Message({
      id: 1,
      message: 'Welcome to Operation Anorak!',
    }),
  ]);
  const [input, setInput] = useState('');
  const wallet = useWallet();

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = new Message({ id: 0, message: input });
    setMessages([...messages, userMessage]);

    // Simulated bot response
    const botReply = new Message({
      id: 1,
      message: `You said: ${input}`,
    });

    setMessages((prevMessages) => [...prevMessages, botReply]);

    setInput('');
  };

  const handleSend = async () => {
  if (input.trim() === '') return;

  const userMessage = new Message({ id: 0, message: input });
  setMessages([...messages, userMessage]);

  try {
    // Send the message to your backend
    const response = await axios.post('/api/chat', { message: input });
    const botReply = new Message({
      id: 1,
      message: response.data.reply,
    });
    setMessages((prevMessages) => [...prevMessages, botReply]);
  } catch (error) {
    console.error(error);
    const errorMessage = new Message({
      id: 1,
      message: 'Sorry, there was an error processing your request.',
    });
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  }

  setInput('');
};
  
  return (
    <div className="App">
      <h1>Operation Anorak</h1>

      {/* Wallet Connect Button */}
      <div style={{ marginBottom: '20px' }}>
        <WalletMultiButton />
      </div>

      {/* Chat Interface */}
      <div className="chat-container">
        <ChatFeed
          messages={messages}
          isTyping={false}
          hasInputField={false}
          showSenderName
          bubblesCentered={false}
          bubbleStyles={{
            text: {
              fontSize: 16,
            },
            chatbubble: {
              borderRadius: 20,
              padding: 10,
            },
          }}
        />
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
