<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GoogleLoginController;
use App\Http\Controllers\ImageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [GoogleLoginController::class, 'login'])->name('login');
    Route::get('/auth/google', [GoogleLoginController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('/auth/google/callback', [GoogleLoginController::class, 'handleGoogleCallback'])->name('google.callback');
});

Route::middleware('auth')->group(function () {
    Route::get('/', function () { return Inertia::render('Todo', [ 'type' => 'todo' ]); })->name('todo');
    Route::get('/house', function () { return Inertia::render('Todo', [ 'type' => 'house' ]); })->name('house');
    Route::get('/calendar', function () { return Inertia::render('Calendar'); })->name('calendar');
    Route::get('/settings', function () { return Inertia::render('Settings'); })->name('settings');

    Route::get('/images/upload/{filename}', [ImageController::class, 'getUploadImage'])->name('image.upload');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function() {
        Route::get('/user', function () { return Inertia::render('Admin/User'); })->name('user');
    });
});
