<?php

namespace App\Repositories;

use App\Models\Subject;
use App\Models\StudyTest;
use App\Models\Question;
use App\Models\Answer;
use Carbon\Carbon;

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
     * ng_count - ok_count > 3
     * ng_count + ok_count = 0
     *
     * @return array
     */
    public static function questions($id, $limit)
    {
        $list = Question::where('study_test_id', $id)
            ->whereRaw('ng_count - ok_count > ?', [3])
            ->orderByRaw('RAND()')->limit($limit)->get();

        if (count($list) < $limit) {
          $yet_list = Question::where('study_test_id', $id)
              ->where('ng_count', 0)
              ->where('ok_count', 0)
              ->orderByRaw('RAND()')->limit($limit-count($list))->get();
          $list = $list->concat($yet_list);
        }

        if (count($list) < $limit) {
          $all_list = Question::where('study_test_id', $id)
              ->orderByRaw('RAND()')->limit($limit-count($list))->get();
          $list = $list->concat($all_list);
        }

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
     * answer Month
     *
     * @return array
     */
    public static function answerDate($date)
    {
        $now = new Carbon($date);
        $data = Answer::select('id', 'study_test_id', 'is_complete', 'created_at')
                    ->whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month)
                    ->get();
        return $data;
    }

    /**
     * answer detail
     *
     * @param int $id
     * @return mixed
    */
    public static function show(int $id)
    {
        return Answer::findOrFail($id);
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
