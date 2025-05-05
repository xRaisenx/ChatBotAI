// components/ProductCard.tsx
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  image: string | null;
  landing_page: string;
  matches?: string;
  onAddToCart?: (productId: string) => void; // Add prop
  productId?: string; // Add productId (assumed to be part of metadata)
}

export function ProductCard({ title, description, price, image, landing_page, matches, onAddToCart, productId }: ProductCardProps) {
  return (
    <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3 flex items-center space-x-3">
      {image && (
        <Image
          alt={title}
          loading="lazy"
          width={80}
          height={80}
          className="rounded-md object-cover"
          src={image}
          sizes="(max-width: 768px) 80px, 80px"
        />
      )}
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
        <p className="text-sm font-bold mt-1">{price}</p>
        <div className="flex space-x-2 mt-2">
          <a
            href={landing_page}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-pink-600 dark:text-pink-300 hover:underline"
          >
            View Product
          </a>
          <button
            className="text-xs bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600"
            onClick={() => productId && onAddToCart && onAddToCart(productId)}
            disabled={!productId || !onAddToCart}
          >
            Add to Cart
          </button>
        </div>
        {matches && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{matches}</p>}
      </div>
    </div>
  );
}
