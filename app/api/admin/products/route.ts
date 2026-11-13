import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Product } from "@/types";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.ts");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").toLowerCase().trim();
    const brand = searchParams.get("brand") || "all";
    const category = searchParams.get("category") || "all";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let filtered = INITIAL_PRODUCTS;

    if (brand !== "all") {
      filtered = filtered.filter((p) => p.brandId === brand);
    }
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.brandName.toLowerCase().includes(search) ||
          (p.fabric && p.fabric.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      totalCount: INITIAL_PRODUCTS.length,
      filteredCount: filtered.length,
      products: filtered.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      category,
      fabric,
      pieceCount,
      originalPrice,
      salePrice,
      isLowestPrice,
      onSale,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product id is required." },
        { status: 400 }
      );
    }

    // Read current products from data/products.ts
    const content = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const marker = "= [";
    const assignIdx = content.indexOf(marker);
    if (assignIdx === -1) {
      return NextResponse.json(
        { success: false, error: "Could not locate products array." },
        { status: 500 }
      );
    }

    const jsonStart = assignIdx + 2;
    const jsonEnd = content.lastIndexOf("]");
    const existingProducts: Product[] = JSON.parse(content.substring(jsonStart, jsonEnd + 1));

    const index = existingProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Product "${id}" not found.` },
        { status: 404 }
      );
    }

    const current = existingProducts[index];
    const newOrig = originalPrice !== undefined ? Number(originalPrice) : current.originalPrice;
    const newSale = salePrice !== undefined ? Number(salePrice) : current.salePrice;
    const newDiscount =
      newOrig > newSale
        ? Math.round(((newOrig - newSale) / newOrig) * 100)
        : current.discountPct;

    const updatedProduct: Product = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      category: category !== undefined ? category : current.category,
      fabric: fabric !== undefined ? fabric.trim() : current.fabric,
      pieceCount: pieceCount !== undefined ? pieceCount : current.pieceCount,
      originalPrice: newOrig,
      salePrice: newSale,
      discountPct: newDiscount,
      isLowestPrice: isLowestPrice !== undefined ? Boolean(isLowestPrice) : current.isLowestPrice,
      onSale: onSale !== undefined ? Boolean(onSale) : current.onSale,
      lastSeenAt: new Date().toISOString(),
    };

    existingProducts[index] = updatedProduct;

    const newFileContent = `// Generated automatically from live Pakistani brand feeds\nimport { Product } from "@/types";\n\nexport const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(
      existingProducts,
      null,
      2
    )};\n`;

    fs.writeFileSync(PRODUCTS_FILE, newFileContent, "utf8");

    return NextResponse.json({
      success: true,
      message: `Product "${updatedProduct.title}" updated successfully!`,
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product details." },
      { status: 500 }
    );
  }
}
