// components/ChatMessage.tsx
import { ProductCard } from './ProductCard';
import DOMPurify from 'isomorphic-dompurify';
import { FaSpinner } from 'react-icons/fa';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  text?: string;
  ai_understanding?: string;
  product_card?: {
    title: string;
    description: string;
    price: string;
    image: string | null;
    landing_page: string;
    matches?: string;
    variantId: string; // Add variantId
  };
  advice?: string;
  isLoading?: boolean;
  isError?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onAddToCart: (productId: string) => void;
}

export function ChatMessage({ message, onAddToCart }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Function to parse advice text for legacy PRODUCT_CARD_START/END markers
  const parseAdvice = (advice: string) => {
    const productCardRegex = /PRODUCT_CARD_START(\{.*?\})PRODUCT_CARD_END/;
    const match = advice.match(productCardRegex);
    let cleanedAdvice = advice;
    let parsedProductCard = message.product_card;

    if (match && match[1]) {
      try {
        const productCardData = JSON.parse(match[1]);
        parsedProductCard = {
          title: productCardData.title,
          description: productCardData.description,
          price: productCardData.price,
          image: productCardData.image,
          landing_page: productCardData.landing_page,
          matches: productCardData.matches,
          variantId: productCardData.variantId || productCardData.landing_page.split('/').pop(), // Fallback for legacy
        };
        // Remove the product card markers and JSON from advice
        cleanedAdvice = advice.replace(productCardRegex, '').trim();
      } catch (error) {
        console.error('Failed to parse product card from advice:', error);
      }
    }

    return { cleanedAdvice, parsedProductCard };
  };

  // Sanitize HTML and parse advice
  const sanitizeOptions = { USE_PROFILES: { html: true }, ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'br', 'p', 'ul', 'ol', 'li'] };
  const { cleanedAdvice, parsedProductCard } = message.advice ? parseAdvice(message.advice) : { cleanedAdvice: '', parsedProductCard: message.product_card };
  const sanitizedAdvice = cleanedAdvice ? DOMPurify.sanitize(cleanedAdvice, sanitizeOptions) : '';
  const sanitizedText = message.text ? DOMPurify.sanitize(message.text, sanitizeOptions) : '';

  // --- Loading Indicator ---
  if (message.isLoading) {
    return (
      <div className="message-base bot-message flex items-center space-x-2 opacity-80">
         <div className="typing-indicator">
            <span className="typing-dot animate-bounce [animation-delay:-0.3s]"></span>
            <span className="typing-dot animate-bounce [animation-delay:-0.15s]"></span>
            <span className="typing-dot animate-bounce"></span>
         </div>
         <span className="text-sm italic">Bella is thinking...</span>
      </div>
    );
  }

  // --- Error Message Styling ---
  if (message.isError) {
       return (
         <div className={`message-base bot-message bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300`}>
            <p className="font-medium">Oops!</p>
            {sanitizedText && <div dangerouslySetInnerHTML={{ __html: sanitizedText }} />}
         </div>
       );
  }

  // --- Standard User/Bot Message ---
  return (
    <div className={`message-base ${isUser ? 'user-message' : 'bot-message'}`}>
      {!isUser && message.ai_understanding && (
        <p className="ai-understanding-text">{message.ai_understanding}</p>
      )}

      {isUser && message.text && (
         <div>{message.text}</div>
      )}

      {!isUser && parsedProductCard && (
        <div className="mt-3 mb-1">
          <ProductCard
            title={parsedProductCard.title}
            description={parsedProductCard.description}
            price={parsedProductCard.price}
            image={parsedProductCard.image}
            landing_page={parsedProductCard.landing_page}
            matches={parsedProductCard.matches}
            productId={parsedProductCard.variantId} // Use variantId
            onAddToCart={onAddToCart}
          />
        </div>
      )}

      {!isUser && sanitizedAdvice && (
        <div className="advice-text" dangerouslySetInnerHTML={{ __html: sanitizedAdvice }} />
      )}
    </div>
  );
}
