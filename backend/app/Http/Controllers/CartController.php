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

        // Populate product details and filter out unavailable items
        $items = [];
        $removedItems = [];
        $cartItems = $cart->items;
        $updatedCartItems = [];
        
        foreach ($cartItems as $item) {
            $product = Product::find($item['product_id']);
            
            // Only include items where product exists and is available
            if ($product && $product->available) {
                $cartItem = [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'product' => $product,
                ];
                
                // Include selected add-ons if they exist
                if (isset($item['selected_addons'])) {
                    $cartItem['selectedAddons'] = $item['selected_addons'];
                }
                
                $items[] = $cartItem;
                $updatedCartItems[] = $item;
            } else {
                // Track removed items for notification
                if ($product) {
                    $removedItems[] = $product->name;
                }
            }
        }
        
        // Update cart if items were removed
        if (count($updatedCartItems) !== count($cartItems)) {
            $cart->items = $updatedCartItems;
            $cart->save();
        }

        return response()->json([
            'items' => $items, 
            'total' => $cart->calculateTotal(),
            'removed_items' => $removedItems
        ]);
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'selected_addons' => 'nullable|array',
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
        $selectedAddons = $request->selected_addons ?? [];
        
        // Create a unique key for items with same product but different add-ons
        $newItemKey = $request->product_id . '_' . json_encode($selectedAddons);
        $found = false;

        // Check if same product with same add-ons already in cart
        foreach ($items as $index => &$item) {
            $itemAddons = $item['selected_addons'] ?? [];
            $itemKey = $item['product_id'] . '_' . json_encode($itemAddons);
            
            if ($itemKey === $newItemKey) {
                $item['quantity'] += $request->quantity;
                $found = true;
                break;
            }
        }

        // Add new item if not found
        if (!$found) {
            $newItem = [
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price,
            ];
            
            // Add selected add-ons if provided
            if (!empty($selectedAddons)) {
                $newItem['selected_addons'] = $selectedAddons;
            }
            
            $items[] = $newItem;
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

