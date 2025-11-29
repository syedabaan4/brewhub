<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    // Order status constants
    const STATUS_RECEIVED = 'received';
    const STATUS_PREPARING = 'preparing';
    const STATUS_READY_FOR_PICKUP = 'ready_for_pickup';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Valid statuses for validation
    const VALID_STATUSES = [
        self::STATUS_RECEIVED,
        self::STATUS_PREPARING,
        self::STATUS_READY_FOR_PICKUP,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
    ];

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
        'estimated_completion_time',
    ];

    protected $casts = [
        'items' => 'array',
        'total_price' => 'float',
        'estimated_completion_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        return match($this->status) {
            self::STATUS_RECEIVED => 'Received',
            self::STATUS_PREPARING => 'Preparing',
            self::STATUS_READY_FOR_PICKUP => 'Ready for Pickup',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_CANCELLED => 'Cancelled',
            default => ucfirst($this->status ?? 'Unknown'),
        };
    }
}

