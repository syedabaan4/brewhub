<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image_url',
        'available',
        'addons',
    ];

    protected $casts = [
        'price' => 'float',
        'available' => 'boolean',
        'addons' => 'array',
    ];
}

