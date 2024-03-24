<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Question;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        for ($i = 1; $i <= 10; $i++) {
            for ($j = 1; $j <= 10; $j++) {
                $question = new Question();
                $question->study_test_id = 1;
                $question->content = "$i+$j";
                $question->answer = $i + $j;
                $question->save();
            }
        }

        for ($i = 1; $i <= 18; $i++) {
            for ($j = 1; $j <= 10; $j++) {
              if ($i - $j < 0) continue;
                $question = new Question();
                $question->study_test_id = 2;
                $question->content = "$i-$j";
                $question->answer = $i - $j;
                $question->save();
            }
        }
    }
}
