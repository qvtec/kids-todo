<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyTest extends Model
{
    protected $table = 'study_tests';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject_id',
        'name',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function question()
    {
        return $this->hasMany(Question::class);
    }
}
