import { NextRequest, NextResponse } from "next/server";
import { INITIAL_PRODUCTS } from "@/data/products";
import { BRANDS } from "@/data/brands";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Find product in catalog
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const brand = BRANDS.find((b) => b.id === product.brandId);

  // In production with Supabase, record click event:
  // await supabase.from('clicks').insert({
  //   product_id: product.id,
  //   brand_id: product.brandId,
  //   user_agent: request.headers.get('user-agent'),
  //   referrer: request.headers.get('referer'),
  //   clicked_at: new Date().toISOString()
  // });

  // Build outbound affiliate URL
  let targetUrl = product.productUrl;

  // Append affiliate tag if available (e.g. ?utm_source=saletracker&utm_medium=affiliate)
  try {
    const url = new URL(targetUrl);
    url.searchParams.set("utm_source", "sabkapray_tracker");
    url.searchParams.set("utm_medium", "affiliate_aggregator");
    url.searchParams.set("utm_campaign", "live_sale_tracker");
    targetUrl = url.toString();
  } catch (err) {
    // If malformed, fallback to raw url
  }

  // 302 Temporary Redirect to the brand official site
  return NextResponse.redirect(targetUrl, { status: 302 });
}
