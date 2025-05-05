// app/api/sync-products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vectorIndex, redisClient } from '@/lib/redis';
import { fetchShopifyProducts } from '@/lib/shopify';

interface ProductVectorMetadata {
  id: string;
  handle: string;
  title: string;
  price: string;
  imageUrl: string | null;
  productUrl: string;
  vendor?: string | null;
  productType?: string | null;
  tags?: string;
  [key: string]: unknown; // Add index signature
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let totalProcessed = 0,
    totalFetched = 0,
    totalErrors = 0;
  const BATCH_SIZE_SHOPIFY = 50;
  const BATCH_SIZE_VECTOR = 100;
  const vectorUpsertBatch: { id: string; data: string; metadata: ProductVectorMetadata }[] = [];

  try {
    let cursor: string | null = null;
    do {
      const { products, pageInfo } = await fetchShopifyProducts(cursor, BATCH_SIZE_SHOPIFY);
      totalFetched += products.length;
      cursor = pageInfo.hasNextPage ? pageInfo.endCursor : null;
      if (products.length === 0) break;

      for (const product of products) {
        try {
          if (!product.id || !product.handle || !product.title) {
            console.warn(`Skipping product: ${product.id || 'N/A'}`);
            totalErrors++;
            continue;
          }

          const cleanedDescription = product.descriptionHtml?.replace(/<[^>]*>?/gm, ' ').trim() || '';
          const dataToIndex = `Product: ${product.title} Brand: ${product.vendor || ''} Type: ${product.productType || ''} Tags: ${product.tags.join(', ')} Description: ${cleanedDescription.substring(0, 500)}`;

          const productIdNumber = product.id.split('/').pop()!;
          const productUrl = product.onlineStoreUrl || `https://${process.env.SHOPIFY_STORE_NAME}/products/${product.handle}`;
          const minPrice = product.priceRange.minVariantPrice;
          const maxPrice = product.priceRange.maxVariantPrice;
          const formattedPrice = minPrice.amount
            ? `${minPrice.amount}${maxPrice.amount !== minPrice.amount ? ` - ${maxPrice.amount}` : ''} ${minPrice.currencyCode}`
            : 'N/A';

          const metadata: ProductVectorMetadata = {
            id: product.id,
            handle: product.handle,
            title: product.title,
            price: formattedPrice,
            imageUrl: product.images.edges[0]?.node.url || null,
            productUrl,
            variantId: product.variants?.edges[0]?.node.id || product.id, // Use variant ID
            vendor: product.vendor,
            productType: product.productType,
            tags: product.tags.join(','),
          };

          vectorUpsertBatch.push({ id: productIdNumber, data: dataToIndex, metadata });

          if (vectorUpsertBatch.length >= BATCH_SIZE_VECTOR) {
            await vectorIndex.upsert(vectorUpsertBatch);
            vectorUpsertBatch.length = 0;
          }

          totalProcessed++;
        } catch (error) {
          console.error(`Error processing ${product.title}:`, error);
          totalErrors++;
        }
      }
    } while (cursor);

    if (vectorUpsertBatch.length > 0) {
      await vectorIndex.upsert(vectorUpsertBatch);
    }

    const testQuery = await vectorIndex.query({ data: 'test', topK: 1 });
    console.log(`Index contains products: ${testQuery.length > 0 ? 'Yes' : 'No'}`);

    const summary = `Sync complete. Fetched: ${totalFetched}, Processed: ${totalProcessed}, Errors: ${totalErrors}`;
    console.log(summary);
    return NextResponse.json({ message: summary });
  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
