import { NextRequest, NextResponse } from "next/server";
import { INITIAL_PRODUCTS } from "@/data/products";
import { BRANDS } from "@/data/brands";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);

  // Find product in catalog
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    // Check if user clicked a brand ID directly
    const directBrand = BRANDS.find((b) => b.id === id || b.slug === id);
    if (directBrand) {
      return NextResponse.redirect(directBrand.saleUrl, { status: 302 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const brand = BRANDS.find((b) => b.id === product.brandId);

  // Fallback to brand official sale page if productUrl is missing or incomplete
  let targetUrl = product.productUrl || brand?.saleUrl || brand?.website || "/";

  // Append affiliate tracking parameters
  try {
    const url = new URL(targetUrl);
    url.searchParams.set("utm_source", "womenfashion");
    url.searchParams.set("utm_medium", "affiliate");
    url.searchParams.set("utm_campaign", "sale_tracker");
    targetUrl = url.toString();
  } catch (err) {
    // If malformed, fallback to raw url
  }

  // 302 Temporary Redirect to the brand official site
  return NextResponse.redirect(targetUrl, { status: 302 });
}
