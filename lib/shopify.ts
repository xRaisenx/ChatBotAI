// lib/shopify.ts
import { createStorefrontApiClient, StorefrontApiClient } from '@shopify/storefront-api-client';

// --- Interfaces for Type Safety ---

// Structure for image nodes
interface ShopifyImageNode {
    url: string;
    altText?: string | null;
}

// Structure for price nodes
interface ShopifyPrice {
    amount: string;
    currencyCode: string;
}

// Structure for the main product node data we want
export interface ShopifyProductNode {
    id: string;
    handle: string;
    title: string;
    descriptionHtml: string | null; // Use HTML description
    vendor: string | null;
    productType: string | null;
    tags: string[];
    onlineStoreUrl: string | null;
    images: { // Structure for images connection
        edges: { node: ShopifyImageNode }[];
    };
    priceRange: { // Structure for price range
        minVariantPrice: ShopifyPrice;
        maxVariantPrice: ShopifyPrice;
    };
    // Add variants if needed for addToCart by variant ID
    variants?: {
        edges: { node: { id: string } }[];
    };
}

// Structure for pagination info
interface ShopifyPageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

// Structure for the edges in the products connection
interface ShopifyProductsEdge {
    node: ShopifyProductNode;
    cursor: string;
}

// Structure for the products connection itself
interface ShopifyProductsConnection {
    edges: ShopifyProductsEdge[];
    pageInfo: ShopifyPageInfo;
}

// Structure for the overall GraphQL response for products
interface ShopifyProductsGraphQLResponse {
    products: ShopifyProductsConnection;
}

// Structure for Cart Create mutation response
interface ShopifyCartCreateResponse {
    cartCreate: {
        cart: { id: string } | null;
        userErrors: Array<{ field: string[] | null; message: string }>;
    } | null;
}

// Structure for Cart Add Lines mutation response
interface ShopifyCartAddLinesResponse {
    cartLinesAdd: {
        cart: { id: string } | null;
        userErrors: Array<{ field: string[] | null; message: string; code?: string }>;
    } | null;
}


// --- Shopify Client Initialization ---

const SHOPIFY_API_VERSION = '2024-07'; // Use latest or desired stable version
let client: StorefrontApiClient | null = null;

function getShopifyClient(): StorefrontApiClient {
    if (client) {
        return client;
    }
    const storeDomain = process.env.SHOPIFY_STORE_NAME;
    const publicAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!publicAccessToken || !storeDomain) {
        console.error("CRITICAL: Missing Shopify Storefront credentials (SHOPIFY_STORE_NAME, SHOPIFY_STOREFRONT_ACCESS_TOKEN).");
        throw new Error('Shopify Storefront credentials are not configured.');
    }

    console.log(`Initializing Shopify Storefront client for domain: ${storeDomain}`);
    client = createStorefrontApiClient({
        storeDomain: `https://${storeDomain}`,
        apiVersion: SHOPIFY_API_VERSION,
        publicAccessToken: publicAccessToken,
    });
    return client;
}

// --- Fetch Products Function ---

export interface FetchResult {
    products: ShopifyProductNode[];
    pageInfo: ShopifyPageInfo;
}

/**
 * Fetches products from Shopify Storefront API with pagination.
 * @param cursor - The pagination cursor from the previous page's pageInfo.endCursor.
 * @param limit - The number of products to fetch per page.
 * @param queryFilter - An optional Shopify query string to filter products (e.g., "tag:lipstick status:active").
 * @returns An object containing the products array and pageInfo.
 */
export async function fetchShopifyProducts(
    cursor: string | null = null,
    limit: number = 50,
    queryFilter: string = "status:active" // Default filter
): Promise<FetchResult> {

    const storefrontClient = getShopifyClient();

    // GraphQL query to fetch products
    // Includes variants(first: 1) to easily get a variant ID for addToCart if needed
    const query = `
      query GetProducts($first: Int!, $after: String, $queryFilter: String) {
        products(first: $first, after: $after, query: $queryFilter) {
          edges {
            cursor
            node {
              id
              handle
              title
              descriptionHtml
              vendor
              productType
              tags
              onlineStoreUrl
              images(first: 1) {
                edges {
                  node {
                    url(transform: {maxWidth: 200, maxHeight: 200, preferredContentType: WEBP})
                    altText
                  }
                }
              }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              variants(first: 1) { # Get first variant ID for potential addToCart
                 edges {
                    node { id }
                 }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const variables = {
        first: limit,
        after: cursor,
        queryFilter: queryFilter,
    };

    console.log(`Fetching Shopify products... Limit: ${limit}, After: ${cursor || 'Start'}, Filter: "${queryFilter}"`);

    try {
        // Make the GraphQL request
        const response: any = await storefrontClient.request(query, { variables });

        // Handle GraphQL level errors
        if (Array.isArray(response.errors) && response.errors.length > 0) {
            console.error("Shopify Storefront API GraphQL Errors:", JSON.stringify(response.errors, null, 2));
            // Access errors array safely
            const errorMessage = response.errors[0]?.message || 'Unknown GraphQL error';
            throw new Error(`Shopify GraphQL Error: ${errorMessage}`);
        }

        // Access data through the 'data' property
        const productsData = response.data?.products;

        // Validate the response structure
        if (!productsData?.edges || !productsData?.pageInfo) {
             console.error("Invalid response structure from Shopify Storefront API:", response);
             throw new Error("Received invalid data structure from Shopify Storefront API.");
        }

        const products = productsData.edges.map((edge: any) => edge.node);
        const pageInfo = productsData.pageInfo;

        console.log(` -> Fetched ${products.length} products. HasNextPage: ${pageInfo.hasNextPage}`);

        return {
            products: products,
            pageInfo: pageInfo,
        };

    } catch (err) {
        console.error("Error during Shopify Storefront fetch:", err);
        // Re-throw the error to be handled by the caller (e.g., the sync route)
        throw err;
    }
}

// --- Add to Cart Function ---

/**
 * Adds a product variant to the Shopify cart. Creates a new cart if no cartId is provided.
 * @param cartId - The ID of the existing cart, or null to create a new one.
 * @param variantId - The GID of the product variant to add (e.g., "gid://shopify/ProductVariant/12345").
 * @param quantity - The quantity of the variant to add.
 * @returns An object containing the updated cartId and any userErrors.
 */
export async function addToCart(
    cartId: string | null,
    variantId: string,
    quantity: number
): Promise<{ cartId: string | null; checkoutUrl?: string; userErrors: any[] }> { // Return userErrors and checkoutUrl

    const storefrontClient = getShopifyClient();
    let currentCartId = cartId;
    let userErrors: any[] = [];

    // 1. Create cart if one doesn't exist
    if (!currentCartId) {
        console.log("No cart ID provided, creating a new cart...");
        const createCartMutation = `
            mutation cartCreate($input: CartInput = {}) { # Allow input for future use (e.g., attributes)
              cartCreate(input: $input) {
                cart { id }
                userErrors { field message }
              }
            }
        `;
        try {
            const response: any = await storefrontClient.request(createCartMutation);
            const { data, errors } = response;


            if (Array.isArray(errors) && errors.length > 0) {
                // Access errors array safely
                const errorMessage = errors[0]?.message || 'Unknown GraphQL error';
                throw new Error(`Shopify GraphQL Error (Cart Create): ${errorMessage}`);
            }

            // Access data through the 'data' property
            if (!data?.cartCreate) {
                 throw new Error("Failed to create cart: No cartCreate data returned.");
            }
            userErrors = data.cartCreate.userErrors || [];
            if (userErrors.length > 0) {
                console.error("Cart Create User Errors:", userErrors);
                // Return errors without throwing, let caller decide
        return { cartId: null, userErrors: userErrors };
    }
    if (!data.cartCreate.cart?.id) throw new Error("Failed to create cart or get cart ID.");

    currentCartId = data.cartCreate.cart.id;
    const checkoutUrl = data.cartCreate.cart.checkoutUrl;
    console.log("New cart created:", currentCartId);
    return { cartId: currentCartId, checkoutUrl, userErrors: [] }; // Return checkoutUrl here
} catch (error) {
    console.error("Error creating Shopify cart:", error);
    throw error; // Re-throw creation error
}
}

    // 2. Add item to cart
    if (!currentCartId) {
        // Should not happen if creation succeeded, but good safety check
        throw new Error("Cannot add to cart: Cart ID is missing.");
    }

    console.log(`Adding item (Variant ID: ${variantId}, Qty: ${quantity}) to cart ${currentCartId}...`);
    const addLinesMutation = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart { id } # Return cart ID to confirm
            userErrors { field message code }
          }
        }
    `;
    const variables = {
        cartId: currentCartId,
        lines: [{ merchandiseId: variantId, quantity: quantity }]
    };

    try {
        const response: any = await storefrontClient.request(addLinesMutation, { variables });
        const { data, errors } = response;


        if (Array.isArray(errors) && errors.length > 0) {
            // Access errors array safely
            const errorMessage = errors[0]?.message || 'Unknown GraphQL error';
            throw new Error(`Shopify GraphQL Error (Cart Add Lines): ${errorMessage}`);
        }

            // Access data through the 'data' property
            if (!data?.cartLinesAdd) {
                 throw new Error("Failed to add lines to cart: No cartLinesAdd data returned.");
            }
            userErrors = data.cartLinesAdd.userErrors || [];
            if (userErrors.length > 0) {
                console.error("Cart Add Lines User Errors:", userErrors);
                // Return errors, let caller handle (e.g., show message "Item out of stock")
            }
            // Check if cart ID is still valid even if there are user errors (e.g., partial success)
            if (!data.cartLinesAdd.cart?.id && userErrors.length === 0) {
                 throw new Error("Failed to add lines to cart, no cart ID returned and no user errors.");
            }

        console.log(`Item added/processed for cart ${currentCartId}.`);
        // Return the potentially updated cart ID, checkoutUrl, and any user errors
        return {
            cartId: data.cartLinesAdd.cart?.id || currentCartId,
            checkoutUrl: data.cartLinesAdd.cart?.checkoutUrl,
            userErrors
        };
    } catch (error) {
        console.error("Error adding lines to Shopify cart:", error);
        throw error; // Re-throw add lines error
    }
}
