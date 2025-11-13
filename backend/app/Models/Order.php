<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'user_id',
        'order_number',
        'items',
        'total_price',
        'status',
        'payment_status',
        'customer_name',
        'customer_email',
        'customer_phone',
    ];

    protected $casts = [
        'items' => 'array',
        'total_price' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

