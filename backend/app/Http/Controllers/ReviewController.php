<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a new review for an order item.
     */
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|string',
            'order_item_index' => 'required|integer|min:0',
            'product_id' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        // Verify the order exists and belongs to the user
        $order = Order::where('_id', $request->order_id)
            ->where('user_id', (string) $user->_id)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found or does not belong to you.',
            ], 404);
        }

        // Verify the order is completed
        if ($order->status !== Order::STATUS_COMPLETED) {
            return response()->json([
                'message' => 'You can only review items from completed orders.',
            ], 400);
        }

        // Verify the order item exists
        $items = $order->items ?? [];
        if (!isset($items[$request->order_item_index])) {
            return response()->json([
                'message' => 'Order item not found.',
            ], 404);
        }

        $orderItem = $items[$request->order_item_index];
        $productId = $orderItem['product_id'] ?? null;

        // Verify the product_id matches
        if ($productId !== $request->product_id) {
            return response()->json([
                'message' => 'Product ID does not match the order item.',
            ], 400);
        }

        // Check if this order item has already been reviewed
        $existingReview = Review::where('user_id', (string) $user->_id)
            ->where('order_id', $request->order_id)
            ->where('order_item_index', $request->order_item_index)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this order item.',
            ], 400);
        }

        // Create the review
        $review = Review::create([
            'user_id' => (string) $user->_id,
            'product_id' => $request->product_id,
            'order_id' => $request->order_id,
            'order_item_index' => $request->order_item_index,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'user_name' => $user->name,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review,
        ], 201);
    }

    /**
     * Get reviews for a specific product (paginated, newest first).
     */
    public function productReviews(Request $request, $productId)
    {
        // Verify the product exists
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found.',
            ], 404);
        }

        $perPage = min($request->input('per_page', 20), 50);

        $reviews = Review::where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Calculate average rating and total count
        $allReviews = Review::where('product_id', $productId)->get();
        $totalReviews = $allReviews->count();
        $averageRating = $totalReviews > 0
            ? round($allReviews->avg('rating'), 1)
            : null;

        return response()->json([
            'product_id' => $productId,
            'average_rating' => $averageRating,
            'total_reviews' => $totalReviews,
            'reviews' => $reviews->items(),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    /**
     * Get review status for order items (which items have been reviewed).
     */
    public function orderReviewStatus($orderId)
    {
        $user = Auth::user();

        // Verify the order exists and belongs to the user
        $order = Order::where('_id', $orderId)
            ->where('user_id', (string) $user->_id)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found or does not belong to you.',
            ], 404);
        }

        // Get all reviews for this order by this user
        $reviews = Review::where('user_id', (string) $user->_id)
            ->where('order_id', $orderId)
            ->get()
            ->keyBy('order_item_index');

        $items = $order->items ?? [];
        $reviewStatus = [];

        foreach ($items as $index => $item) {
            $review = $reviews->get($index);
            $reviewStatus[] = [
                'order_item_index' => $index,
                'product_id' => $item['product_id'] ?? null,
                'product_name' => $item['product_name'] ?? ($item['product']['name'] ?? 'Unknown'),
                'reviewed' => $review !== null,
                'review' => $review,
            ];
        }

        return response()->json([
            'order_id' => $orderId,
            'can_review' => $order->status === Order::STATUS_COMPLETED,
            'items' => $reviewStatus,
        ]);
    }
}
