<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();

        // Get all product IDs
        $productIds = $products
            ->pluck("_id")
            ->map(fn($id) => (string) $id)
            ->toArray();

        // Fetch review stats for all products in one query
        $reviewStats = Review::raw(function ($collection) use ($productIds) {
            return $collection->aggregate([
                [
                    '$match' => [
                        "product_id" => ['$in' => $productIds],
                    ],
                ],
                [
                    '$group' => [
                        "_id" => '$product_id',
                        "average_rating" => ['$avg' => '$rating'],
                        "review_count" => ['$sum' => 1],
                    ],
                ],
            ]);
        });

        // Convert to keyed array for quick lookup
        $statsMap = [];
        foreach ($reviewStats as $stat) {
            $statsMap[$stat->_id] = [
                "average_rating" => round($stat->average_rating, 1),
                "review_count" => $stat->review_count,
            ];
        }

        // Add rating info to each product
        $productsWithRatings = $products->map(function ($product) use (
            $statsMap,
        ) {
            $productArray = $product->toArray();
            $productId = (string) $product->_id;

            if (isset($statsMap[$productId])) {
                $productArray["average_rating"] =
                    $statsMap[$productId]["average_rating"];
                $productArray["review_count"] =
                    $statsMap[$productId]["review_count"];
            } else {
                $productArray["average_rating"] = null;
                $productArray["review_count"] = 0;
            }

            return $productArray;
        });

        return response()->json($productsWithRatings);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["message" => "Product not found"], 404);
        }

        // Get review stats for this product
        $reviews = Review::where("product_id", (string) $product->_id)->get();
        $reviewCount = $reviews->count();
        $averageRating =
            $reviewCount > 0 ? round($reviews->avg("rating"), 1) : null;

        $productArray = $product->toArray();
        $productArray["average_rating"] = $averageRating;
        $productArray["review_count"] = $reviewCount;

        return response()->json($productArray);
    }

    public function categories()
    {
        $categories = Product::distinct("category")->pluck("category");
        return response()->json($categories);
    }
}
