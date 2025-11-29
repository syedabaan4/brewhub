<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderConfirmation;
use App\Notifications\OrderStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'total_price' => 'required|numeric',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|regex:/^[\d\s\-\+\(\)]+$/|min:10|max:20',
            'payment_status' => 'required|string|in:pending,paid,failed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Generate unique order number
        $orderNumber = 'BH' . strtoupper(uniqid()) . rand(100, 999);

        // Enrich items with product names for email
        $enrichedItems = collect($request->items)->map(function ($item) {
            $product = Product::find($item['product_id']);
            return array_merge($item, [
                'product_name' => $product ? $product->name : 'Unknown Product'
            ]);
        })->toArray();

        // Set initial status: 'received' for paid orders, 'pending' otherwise
        $initialStatus = $request->payment_status === 'paid' 
            ? Order::STATUS_RECEIVED 
            : 'pending';

        // Calculate default ETA (15 minutes from now for paid orders)
        $estimatedCompletionTime = $request->payment_status === 'paid'
            ? now()->addMinutes(15)
            : null;

        $order = Order::create([
            'user_id' => $request->user()->_id,
            'order_number' => $orderNumber,
            'items' => $enrichedItems,
            'total_price' => $request->total_price,
            'status' => $initialStatus,
            'payment_status' => $request->payment_status,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'estimated_completion_time' => $estimatedCompletionTime,
        ]);

        // Update user's phone number if provided
        $user = $request->user();
        if ($request->customer_phone && $user->phone !== $request->customer_phone) {
            $user->phone = $request->customer_phone;
            $user->save();
        }

        // Send order confirmation email
        try {
            $recipientUser = User::where('email', $request->customer_email)->first();
            if ($recipientUser) {
                $recipientUser->notify(new OrderConfirmation($order));
            } else {
                // If email doesn't match a user, send notification directly
                Notification::route('mail', $request->customer_email)
                    ->notify(new OrderConfirmation($order));
            }
        } catch (\Exception $e) {
            // Log error but don't fail the order
            \Log::error('Failed to send order confirmation email: ' . $e->getMessage());
        }

        // Clear user's cart after order is placed
        $cart = Cart::where('user_id', $request->user()->_id)->first();
        if ($cart) {
            $cart->items = [];
            $cart->save();
        }

        return response()->json($order, 201);
    }

    public function show(Request $request, $id)
    {
        $order = Order::where('_id', $id)
            ->where('user_id', $request->user()->_id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function update(Request $request, $id)
    {
        $validStatuses = implode(',', Order::VALID_STATUSES);
        
        $validator = Validator::make($request->all(), [
            'status' => "sometimes|string|in:{$validStatuses}",
            'payment_status' => 'sometimes|string|in:pending,paid,failed',
            'estimated_completion_time' => 'sometimes|nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Admin middleware handles authorization
        $order = Order::where('_id', $id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $previousStatus = $order->status;
        $statusChanged = false;

        // Update only the fields that were provided
        if ($request->has('status') && $request->status !== $order->status) {
            $order->status = $request->status;
            $statusChanged = true;
        }
        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }
        if ($request->has('estimated_completion_time')) {
            $order->estimated_completion_time = $request->estimated_completion_time;
        }

        $order->save();

        // Send notification if status changed
        if ($statusChanged) {
            try {
                $recipientUser = User::where('email', $order->customer_email)->first();
                if ($recipientUser) {
                    $recipientUser->notify(new OrderStatusUpdated($order, $previousStatus));
                } else {
                    Notification::route('mail', $order->customer_email)
                        ->notify(new OrderStatusUpdated($order, $previousStatus));
                }
            } catch (\Exception $e) {
                \Log::error('Failed to send order status update email: ' . $e->getMessage());
            }
        }

        return response()->json($order);
    }

    /**
     * Get all orders (admin only).
     */
    public function adminIndex(Request $request)
    {
        $orders = Order::orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }
}

