<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'total_price' => 'required|numeric',
            'delivery_address' => 'required|string',
            'payment_status' => 'required|string|in:pending,paid,failed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = Order::create([
            'user_id' => $request->user()->_id,
            'items' => $request->items,
            'total_price' => $request->total_price,
            'status' => 'pending',
            'payment_status' => $request->payment_status,
            'delivery_address' => $request->delivery_address,
        ]);

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
}

