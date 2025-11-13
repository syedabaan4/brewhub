<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Cart extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'carts';

    protected $fillable = [
        'user_id',
        'items',
    ];

    protected $casts = [
        'items' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function calculateTotal()
    {
        $total = 0;
        foreach ($this->items as $item) {
            $itemTotal = $item['price'] * $item['quantity'];
            
            // Add selected add-ons price if they exist
            if (isset($item['selected_addons']) && is_array($item['selected_addons'])) {
                foreach ($item['selected_addons'] as $addon) {
                    $itemTotal += $addon['price'] * $item['quantity'];
                }
            }
            
            $total += $itemTotal;
        }
        return $total;
    }
}

