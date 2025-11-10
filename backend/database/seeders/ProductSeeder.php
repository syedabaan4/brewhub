<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Espresso',
                'description' => 'Strong and bold shot of pure coffee excellence',
                'price' => 2.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Cappuccino',
                'description' => 'Perfect balance of espresso, steamed milk, and foam',
                'price' => 4.49,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Latte',
                'description' => 'Smooth espresso with velvety steamed milk',
                'price' => 4.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Americano',
                'description' => 'Espresso shots topped with hot water for a rich flavor',
                'price' => 3.49,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Mocha',
                'description' => 'Chocolate-flavored variant of a latte',
                'price' => 5.49,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Caramel Macchiato',
                'description' => 'Espresso with vanilla-flavored syrup and caramel drizzle',
                'price' => 5.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Iced Coffee',
                'description' => 'Chilled coffee served over ice',
                'price' => 3.99,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Cold Brew',
                'description' => 'Smooth, naturally sweet coffee steeped for 12 hours',
                'price' => 4.49,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Iced Latte',
                'description' => 'Espresso with cold milk served over ice',
                'price' => 4.99,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Frappuccino',
                'description' => 'Blended coffee drink with ice and flavored syrups',
                'price' => 5.99,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Flat White',
                'description' => 'Espresso with microfoam for a velvety texture',
                'price' => 4.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Turkish Coffee',
                'description' => 'Traditional coffee prepared in a cezve with fine grounds',
                'price' => 3.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}

