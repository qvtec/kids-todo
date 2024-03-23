<?php

namespace App\Repositories;

use App\Models\Subject;

class SubjectRepository
{
    /**
     * all
     *
     * @return array
     */
    public static function all()
    {
        $list = Subject::all();
        return $list;
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
