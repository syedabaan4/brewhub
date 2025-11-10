<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->_id)->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $request->user()->_id,
                'items' => [],
            ]);
        }

        // Populate product details
        $items = [];
        foreach ($cart->items as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $items[] = [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'product' => $product,
                ];
            }
        }

        return response()->json(['items' => $items, 'total' => $cart->calculateTotal()]);
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::find($request->product_id);

        if (!$product || !$product->available) {
            return response()->json(['message' => 'Product not available'], 404);
        }

        $cart = Cart::where('user_id', $request->user()->_id)->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $request->user()->_id,
                'items' => [],
            ]);
        }

        $items = $cart->items;
        $found = false;

        // Check if product already in cart
        foreach ($items as &$item) {
            if ($item['product_id'] === $request->product_id) {
                $item['quantity'] += $request->quantity;
                $found = true;
                break;
            }
        }

        // Add new item if not found
        if (!$found) {
            $items[] = [
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price,
            ];
        }

        $cart->items = $items;
        $cart->save();

        return $this->index($request);
    }

    public function update(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cart = Cart::where('user_id', $request->user()->_id)->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $items = $cart->items;

        foreach ($items as &$item) {
            if ($item['product_id'] === $productId) {
                $item['quantity'] = $request->quantity;
                break;
            }
        }

        $cart->items = $items;
        $cart->save();

        return $this->index($request);
    }

    public function remove(Request $request, $productId)
    {
        $cart = Cart::where('user_id', $request->user()->_id)->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $items = array_filter($cart->items, function ($item) use ($productId) {
            return $item['product_id'] !== $productId;
        });

        $cart->items = array_values($items);
        $cart->save();

        return $this->index($request);
    }

    public function clear(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->_id)->first();

        if ($cart) {
            $cart->items = [];
            $cart->save();
        }

        return response()->json(['message' => 'Cart cleared']);
    }
}

