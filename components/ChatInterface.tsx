// components/ChatInterface.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPaperPlane, FaTrashAlt } from 'react-icons/fa';
import { ThemeToggle } from './ThemeToggle';
import { ChatMessage, Message } from './ChatMessage';
import { addToCart } from '../lib/shopify';
import { v4 as uuidv4 } from 'uuid';

// Example suggested questions
const suggestedQuestions = [
    "What’s the best moisturizer for dry skin?",
    "Can you recommend a sulfate-free shampoo?",
    "What products help with oily skin?",
    "Show me vegan lipsticks under $20.",
    "How do I choose a foundation shade?"
];

const welcomeMessageText = process.env.NEXT_PUBLIC_WELCOME_MESSAGE || "Welcome! How can I help you today?";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createWelcomeMessage = useCallback((): Message => ({
    id: uuidv4(),
    role: 'bot',
    ai_understanding: "Initial greeting.",
    advice: welcomeMessageText,
  }), []);

  useEffect(() => {
    setMessages([createWelcomeMessage()]);
    inputRef.current?.focus();
  }, [createWelcomeMessage]);

  useEffect(() => {
    if (chatAreaRef.current) {
        chatAreaRef.current.scrollTo({
          top: chatAreaRef.current.scrollHeight,
          behavior: 'smooth',
        });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handler for adding a product to cart
  const handleAddToCart = useCallback(async (variantId: string) => {
    try {
      const { cartId: newCartId, checkoutUrl, userErrors } = await addToCart(cartId, variantId, 1);
      if (userErrors.length > 0) {
        console.error('Cart errors:', userErrors);
        alert(`Failed to add product to cart: ${userErrors.map(e => e.message).join(', ')}`);
        return;
      }
      if (!newCartId) {
        throw new Error('No cart ID returned.');
      }
      setCartId(newCartId); // Update cartId state
      console.log(`Product added to cart: ${newCartId}`);
      if (checkoutUrl) {
        alert('Product added to cart! Proceed to checkout?');
        window.open(checkoutUrl, '_blank');
      } else {
        alert('Product added to cart!');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Sorry, there was an error adding the product to your cart.');
    }
  }, [cartId]);

  const sendMessage = useCallback(async (messageText: string) => {
    const trimmedText = messageText.trim();
    if (!trimmedText || isLoading) return;

    const userMessageId = uuidv4();
    const userMessage: Message = { id: userMessageId, role: 'user', text: trimmedText };

    const loadingMessageId = uuidv4();
    setMessages((prev) => [
        ...prev,
        userMessage,
        { id: loadingMessageId, role: 'bot', isLoading: true }
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const historyToSend = messages
          .filter(m => !m.isLoading && !m.isError)
          .slice(-6)
          .map(({ ...rest }) => rest);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmedText, history: historyToSend }),
      });

      let data: Message | { error: string };
      if (!response.ok) {
        try { data = await response.json(); }
        catch { data = { error: `API error: ${response.status} ${response.statusText}` }; }
        throw new Error((data as { error: string }).error || 'API request failed');
      }

      data = await response.json();
      console.log('Received API response:', data);

      setMessages((prev) => [
          ...prev.filter(msg => msg.id !== loadingMessageId),
          { ...(data as Message), id: uuidv4(), role: 'bot' }
      ]);
    } catch (error) {
      console.error('Failed to send/process message:', error);
      setMessages((prev) => [
          ...prev.filter(msg => msg.id !== loadingMessageId),
          {
              id: uuidv4(),
              role: 'bot',
              isError: true,
              text: `Sorry, something went wrong. Please try again. ${error instanceof Error ? `(${error.message.substring(0, 100)})` : ''}`
          }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading, messages]);

  const handleSendClick = () => { sendMessage(input); };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage(input);
    }
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
    setTimeout(() => sendMessage(question), 0);
  };

  const handleClearChat = useCallback(() => {
    setMessages([createWelcomeMessage()]);
    setInput('');
    setCartId(null);
    inputRef.current?.focus();
  }, [createWelcomeMessage]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        Planet Beauty AI Assistant ✨
      </div>
      <div ref={chatAreaRef} className="chat-area">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onAddToCart={handleAddToCart} />
        ))}
      </div>
      {messages.length <= 1 && !isLoading && (
        <div className="examples-container border-t border-border-light dark:border-border-dark">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(q)}
              className="example-chip"
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <div className="input-area">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder="Ask about products or beauty tips..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          autoComplete="off"
          aria-label="Type your beauty question or search products"
        />
        <button
          id="send-btn"
          className="icon-button send-btn"
          onClick={handleSendClick}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <FaPaperPlane size={16}/>
        </button>
        <button
          className="icon-button theme-toggle"
          onClick={handleClearChat}
          disabled={messages.length <= 1}
          aria-label="Clear chat history"
          title="Clear Chat"
        >
          <FaTrashAlt size={16} />
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
