// app/api/chat/route.ts
import { callGeminiForUnderstanding } from '@/lib/gemini';
import { UPSTASH_VECTOR_INDEX_NAME, vectorIndex } from '@/lib/redis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QueryResult } from '@upstash/vector';
import { NextRequest, NextResponse } from 'next/server';
import { Content } from '@google/generative-ai';

// Metadata structure expected from vector search results
interface ProductVectorMetadata {
    id: string;
    handle: string;
    title: string;
    price: string;
    imageUrl: string | null;
    productUrl: string;
    variantId: string; // Add variantId
    vendor?: string | null;
    productType?: string | null;
    tags?: string;
}

// Structure of the final product card sent to frontend
interface ProductCardResponse {
    title: string;
    description: string;
    price: string;
    image: string | null;
    landing_page: string;
    variantId: string; // Add variantId
}

// Final API response structure
interface ChatApiResponse {
    ai_understanding: string;
    product_card?: ProductCardResponse;
    advice: string;
}

// Type guard to validate ProductVectorMetadata
function isProductVectorMetadata(metadata: unknown): metadata is ProductVectorMetadata {
    if (typeof metadata !== 'object' || metadata === null) {
        return false;
    }

    const potentialMetadata = metadata as { [key: string]: unknown };

    return (
        typeof potentialMetadata.id === 'string' &&
        typeof potentialMetadata.handle === 'string' &&
        typeof potentialMetadata.title === 'string' &&
        typeof potentialMetadata.price === 'string' &&
        (potentialMetadata.imageUrl === null || typeof potentialMetadata.imageUrl === 'string') &&
        typeof potentialMetadata.productUrl === 'string' &&
        typeof potentialMetadata.variantId === 'string' &&
        (potentialMetadata.vendor === undefined || potentialMetadata.vendor === null || typeof potentialMetadata.vendor === 'string') &&
        (potentialMetadata.productType === undefined || potentialMetadata.productType === null || typeof potentialMetadata.productType === 'string') &&
        (potentialMetadata.tags === undefined || typeof potentialMetadata.tags === 'string')
    );
}

export async function POST(req: NextRequest) {
  let searchNote = "";

  try {
    const body = await req.json();
    const { query, history = [] } = body as { query: string; history: Array<{ role: 'user' | 'bot' | 'model', text?: string }> };

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid query provided' }, { status: 400 });
    }
    const trimmedQuery = query.trim();
    console.log(`Processing query: "${trimmedQuery}"`);

    const geminiHistory = history
        .filter(msg => msg.text && msg.text.trim().length > 0)
        .map(msg => ({
            role: (msg.role === 'bot' ? 'assistant' : 'user') as "user" | "assistant",
            content: msg.text as string
        }));

    // 1. Get AI Understanding, Advice, and Search Keywords
    const geminiResult = await callGeminiForUnderstanding(trimmedQuery, geminiHistory);

    if (!geminiResult) {
        console.error("Failed to get response from Gemini understanding call.");
        const fallbackResponse: ChatApiResponse = {
            ai_understanding: "I had trouble processing that request.",
            advice: "Could you please try rephrasing your question or try again shortly?",
        };
        return NextResponse.json(fallbackResponse, { status: 500 });
    }
    console.log("Gemini Result:", geminiResult);

    let finalProductCard: ProductCardResponse | undefined = undefined;
    const K = 1;
    const SIMILARITY_THRESHOLD = 0.70;

    // Helper function to perform the vector query
    const performVectorQuery = async (searchText: string): Promise<QueryResult<ProductVectorMetadata> | null> => {
        if (!searchText || searchText.trim().length === 0) {
            console.log("No search text provided for vector query.");
            return null;
        }
        try {
            console.log(`Querying vector index '${UPSTASH_VECTOR_INDEX_NAME}' with data: "${searchText.substring(0, 70)}..."`);
            const results = await vectorIndex.query({
                data: searchText,
                topK: K,
                includeMetadata: true,
            });
            if (results && results.length > 0) {
                console.log(` -> Top match ID: ${results[0].id}, Score: ${results[0].score.toFixed(4)}, Metadata: ${results[0].metadata ? 'Present' : 'Missing'}`);
                // Validate metadata
                if (results[0].metadata && isProductVectorMetadata(results[0].metadata)) {
                    // Construct QueryResult<ProductVectorMetadata> manually
                    const validatedResult: QueryResult<ProductVectorMetadata> = {
                        id: results[0].id,
                        score: results[0].score,
                        metadata: results[0].metadata,
                        data: results[0].data,
                    };
                    return validatedResult;
                } else {
                    console.warn('Metadata does not match ProductVectorMetadata:', results[0].metadata);
                    return null;
                }
            } else {
                console.log(" -> No results found for this vector query.");
                return null;
            }
        } catch (error) {
            console.error(`Upstash Vector Query Error for index '${UPSTASH_VECTOR_INDEX_NAME}':`, error);
            searchNote = "\n(Note: There was an issue searching for products.)";
            return null;
        }
    };

    // --- Vector Search Logic ---
    let topMatch: QueryResult<ProductVectorMetadata> | null = null;
    let searchStageUsed = "None";

    // Stage 1: Search using AI Keywords (if available)
    if (geminiResult.search_keywords.trim().length > 0) {
        console.log("Attempting search with AI keywords...");
        topMatch = await performVectorQuery(geminiResult.search_keywords);
        searchStageUsed = "AI Keywords";
    } else {
        console.log("Skipping keyword search as AI keywords are empty.");
    }

    // Stage 2: Search using Direct Query (if Stage 1 failed or below threshold)
    if (!topMatch || topMatch.score < SIMILARITY_THRESHOLD) {
        const logReason = !topMatch ? "Keyword search yielded no result or was skipped" : `Keyword search score (${topMatch.score.toFixed(4)}) below threshold ${SIMILARITY_THRESHOLD}`;
        console.log(`${logReason}. Attempting search with direct query...`);

        const directMatch = await performVectorQuery(trimmedQuery);
        searchStageUsed = "Direct Query";

        if (directMatch && directMatch.score >= SIMILARITY_THRESHOLD) {
            if (!topMatch || directMatch.score > topMatch.score) {
                console.log(`Direct query search found a better match (Score: ${directMatch.score.toFixed(4)})`);
                topMatch = directMatch;
            } else {
                console.log(`Direct query match (Score: ${directMatch.score.toFixed(4)}) was not better than keyword match (Score: ${topMatch.score.toFixed(4)}). Keeping keyword match.`);
                searchStageUsed = "AI Keywords (Kept)";
            }
        } else if (topMatch) {
            console.log(`Direct query search did not yield a result above threshold. Keeping keyword result (Score: ${topMatch.score.toFixed(4)})`);
            searchStageUsed = "AI Keywords (Kept)";
        } else {
            console.log("Direct query search also failed or was below threshold.");
            searchStageUsed = "Direct Query (Failed)";
        }
    }

    // --- Process the final topMatch ---
    if (topMatch && topMatch.metadata && topMatch.score >= SIMILARITY_THRESHOLD) {
        const productData = topMatch.metadata;
        console.log(`Final Match Found (using ${searchStageUsed}): "${productData.title}", Score: ${topMatch.score.toFixed(4)}`);

        finalProductCard = {
            title: productData.title,
            description: `Found product related to your query.`,
            price: productData.price,
            image: productData.imageUrl,
            landing_page: productData.productUrl,
            variantId: productData.variantId, // Add variantId
        };
        searchNote = "";
    } else {
        if (topMatch) {
            console.log(`Best match found (using ${searchStageUsed}) was below threshold: "${topMatch.metadata?.title}", Score: ${topMatch.score.toFixed(4)}`);
            searchNote = "\n(I found something similar, but wasn't sure if it was the best match. Could you be more specific?)";
        } else {
            console.log(`No matching products found above threshold after ${searchStageUsed} stage.`);
            if (geminiResult.search_keywords.trim().length > 0 || trimmedQuery.length > 0) {
                searchNote = "\n(I couldn't find specific products matching your request in the catalog right now.)";
            }
        }
        finalProductCard = undefined;
    }

    // 4. Construct Final Response
    const finalResponse: ChatApiResponse = {
      ai_understanding: geminiResult.ai_understanding,
      product_card: finalProductCard,
      advice: geminiResult.advice + searchNote,
    };

    console.log("Sending final response:", JSON.stringify(finalResponse, null, 2));
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse: ChatApiResponse = {
        ai_understanding: "An error occurred.",
        advice: `Sorry, I encountered a problem processing your request. Please try again later. (Ref: ${errorMessage.substring(0,100)})`,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
