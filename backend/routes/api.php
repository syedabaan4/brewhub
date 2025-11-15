<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);

// Product routes (public)
Route::get("/products", [ProductController::class, "index"]);
Route::get("/products/{id}", [ProductController::class, "show"]);
Route::get("/categories", [ProductController::class, "categories"]);
Route::get("/health", function () {
    return response()->json(
        [
            "status" => "healthy",
            "timestamp" => now()->toIso8601String(),
            "service" => "brewhub-api",
            "php_version" => PHP_VERSION,
        ],
        200,
    );
});

// Protected routes
Route::middleware("auth:sanctum")->group(function () {
    // Auth routes
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::get("/user", [AuthController::class, "user"]);

    // Profile routes
    Route::get("/profile", [ProfileController::class, "show"]);
    Route::put("/profile", [ProfileController::class, "update"]);

    // Cart routes
    Route::get("/cart", [CartController::class, "index"]);
    Route::post("/cart/add", [CartController::class, "add"]);
    Route::put("/cart/update/{productId}", [CartController::class, "update"]);
    Route::delete("/cart/remove/{productId}", [
        CartController::class,
        "remove",
    ]);
    Route::delete("/cart/clear", [CartController::class, "clear"]);

    // Order routes
    Route::get("/orders", [OrderController::class, "index"]);
    Route::post("/orders", [OrderController::class, "store"]);
    Route::get("/orders/{id}", [OrderController::class, "show"]);
    Route::put("/orders/{id}", [OrderController::class, "update"]); // For admin status updates
});
