<?php

namespace App\Repositories;

use App\Models\Subject;
use App\Models\StudyTest;
use App\Models\Question;
use App\Models\Answer;

class StudyRepository
{
    /**
     * all
     *
     * @return array
     */
    public static function all()
    {
        $list = StudyTest::with('subject')->get();
        return $list;
    }

    /**
     * search
     *
     * @return array
     */
    public static function search()
    {
        $list = Subject::with('studyTest')->get();
        return $list;
    }

    /**
     * questions
     *
     * @return array
     */
    public static function questions($id)
    {
        $list = Question::where('study_test_id', $id)->get();
        return $list;
    }

    /**
     * answer
     *
     * @return array
     */
    public static function answer($data)
    {
        $result_contens = $data['result_contens'];

        foreach ($result_contens as $content) {
            $question = Question::findOrFail($content['id']);
            if (isset($content['is_failed']) && $content['is_failed']) {
                $question->update(['ng_count' => $question['ng_count'] + 1]);
            } else {
                $question->update(['ok_count' => $question['ok_count'] + 1]);
            }
        }

        return Answer::create($data);
    }

    /**
    * @param int $id
    * @return mixed
    */
    public static function show(int $id)
    {
        return Subject::findOrFail($id);
    }

    /**
    * @param array $data
    * @return mixed
    */
    public static function store(array $data)
    {
        return Subject::create($data);
    }

    /**
    * @param array $data
    * @param int $id
    * @return mixed
    */
    public static function update(array $data, int $id)
    {
        $record = Subject::find($id);
        return $record->update($data);
    }

    /**
    * @param int $id
    * @return int
    */
    public static function delete(int $id)
    {
        return Subject::destroy($id);
    }
}
