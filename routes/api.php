<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\CheckController;
use App\Http\Controllers\Api\StudyController;
use App\Http\Controllers\Api\Admin\StudyMasterController;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('todo', TodoController::class);
    Route::apiResource('check', CheckController::class);

    Route::get('todo-all', [TodoController::class, 'todoAll'])->name('todo.all');

    Route::prefix('study')->name('study.')->group(function() {
        Route::get('subject', [StudyController::class, 'subject'])->name('subject');
        Route::get('question/{study_test_id}', [StudyController::class, 'question'])->name('question');
        Route::post('answer', [StudyController::class, 'answer'])->name('answer');
        Route::get('answer/{id}', [StudyController::class, 'show'])->name('answer.show');
    });

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function() {
        Route::apiResource('user', UserController::class);
        Route::apiResource('study', StudyMasterController::class);
    });
});
