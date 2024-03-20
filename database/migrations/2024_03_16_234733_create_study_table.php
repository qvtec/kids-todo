<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
        });
        Schema::create('study_tests', function (Blueprint $table) {
            $table->id();
            $table->integer('subject_id')->nullable();
            $table->string('name')->nullable();
            $table->timestamps();
        });
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->integer('study_test_id')->nullable();
            $table->string('content')->nullable();
            $table->string('answer')->nullable();
            $table->integer('ng_count')->default(0);
            $table->integer('ok_count')->default(0);
            $table->timestamps();
        });
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->integer('study_test_id')->nullable();
            $table->integer('score')->nullable();
            $table->time('time')->nullable();
            $table->json('result_contens')->nullable();
            $table->boolean('is_complete')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('study_tests');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('answers');
    }
};
