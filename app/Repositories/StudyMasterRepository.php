<?php

namespace App\Repositories;

use App\Models\Subject;
use App\Models\StudyTest;
use App\Models\Question;
use App\Models\Answer;

class StudyMasterRepository
{
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
    * @param int $id
    * @return mixed
    */
    public static function show(int $id)
    {
        return StudyTest::with('question')->findOrFail($id);
    }

    /**
    * @param array $data
    * @return mixed
    */
    public static function store(array $data)
    {
        $studyTest = StudyTest::create([
            'subject_id' => $data['subject_id'],
            'name' => $data['name'],
            'countdown' => $data['countdown'],
            'total' => $data['total'],
        ]);

        foreach ($data['question'] as $question) {
            $data = [
                'study_test_id' => $studyTest->id,
                'content' => $question['content'],
                'answer' => $question['answer'],
            ];
            Question::create($data);
        }
        return $studyTest;
    }

    /**
    * @param array $data
    * @param int $id
    * @return mixed
    */
    public static function update(array $data, int $id)
    {
        $studyTest = StudyTest::find($id);
        $studyTest->update([
            'subject_id' => $data['subject_id'],
            'name' => $data['name'],
            'countdown' => $data['countdown'],
            'total' => $data['total'],
        ]);

        foreach ($data['question'] as $question) {
            if (isset($question['id'])) {
                $question = Question::find($question['id']);
                $data = [
                    'content' => $question['content'],
                    'answer' => $question['answer'],
                ];
                $question->update($data);
            } else {
                $data = [
                    'study_test_id' => $studyTest->id,
                    'content' => $question['content'],
                    'answer' => $question['answer'],
                ];
                Question::create($data);
            }
        }
        return $studyTest;
    }

    /**
    * @param int $id
    * @return int
    */
    public static function delete(int $id)
    {
        $data = StudyTest::destroy($id);
        Question::where('study_test_id', $id)->delete();
        return $data;
    }
}
