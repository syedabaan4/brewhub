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
        $coffeeAddons = [
            [
                'name' => 'Extra Shot',
                'price' => 0.75,
                'available' => true,
            ],
            [
                'name' => 'Oat Milk',
                'price' => 0.50,
                'available' => true,
            ],
            [
                'name' => 'Almond Milk',
                'price' => 0.50,
                'available' => true,
            ],
            [
                'name' => 'Soy Milk',
                'price' => 0.50,
                'available' => false,
            ],
            [
                'name' => 'Vanilla Syrup',
                'price' => 0.60,
                'available' => true,
            ],
            [
                'name' => 'Caramel Syrup',
                'price' => 0.60,
                'available' => true,
            ],
            [
                'name' => 'Hazelnut Syrup',
                'price' => 0.60,
                'available' => false,
            ],
        ];

        $products = [
            // Hot Coffee
            [
                'name' => 'Espresso',
                'description' => 'Strong and bold shot of pure coffee excellence',
                'price' => 2.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Cappuccino',
                'description' => 'Perfect balance of espresso, steamed milk, and foam',
                'price' => 4.49,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Latte',
                'description' => 'Smooth espresso with velvety steamed milk',
                'price' => 4.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Americano',
                'description' => 'Espresso shots topped with hot water for a rich flavor',
                'price' => 3.49,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Mocha',
                'description' => 'Chocolate-flavored variant of a latte',
                'price' => 5.49,
                'category' => 'hot',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Flat White',
                'description' => 'Espresso with microfoam for a velvety texture',
                'price' => 4.99,
                'category' => 'hot',
                'image_url' => '',
                'available' => false,
            ],
            // Cold Coffee
            [
                'name' => 'Iced Coffee',
                'description' => 'Chilled coffee served over ice',
                'price' => 3.99,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Cold Brew',
                'description' => 'Smooth, naturally sweet coffee steeped for 12 hours',
                'price' => 4.49,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Iced Latte',
                'description' => 'Espresso with cold milk served over ice',
                'price' => 4.99,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            [
                'name' => 'Frappuccino',
                'description' => 'Blended coffee drink with ice and flavored syrups',
                'price' => 5.99,
                'category' => 'cold',
                'image_url' => '',
                'available' => true,
                'addons' => $coffeeAddons,
            ],
            // Pastries
            [
                'name' => 'Butter Croissant',
                'description' => 'Flaky, buttery French pastry baked fresh daily',
                'price' => 3.49,
                'category' => 'pastries',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Chocolate Croissant',
                'description' => 'Buttery croissant filled with rich dark chocolate',
                'price' => 4.29,
                'category' => 'pastries',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Blueberry Muffin',
                'description' => 'Moist muffin packed with fresh blueberries',
                'price' => 3.99,
                'category' => 'pastries',
                'image_url' => '',
                'available' => true,
            ],
            // Desserts
            [
                'name' => 'Tiramisu',
                'description' => 'Classic Italian dessert with coffee-soaked ladyfingers',
                'price' => 6.99,
                'category' => 'desserts',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Chocolate Brownie',
                'description' => 'Rich, fudgy brownie with chocolate chunks',
                'price' => 4.49,
                'category' => 'desserts',
                'image_url' => '',
                'available' => true,
            ],
            [
                'name' => 'Cheesecake',
                'description' => 'Creamy New York style cheesecake with graham crust',
                'price' => 6.49,
                'category' => 'desserts',
                'image_url' => '',
                'available' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}

