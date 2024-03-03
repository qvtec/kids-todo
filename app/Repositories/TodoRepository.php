<?php

namespace App\Repositories;

use App\Models\Todo;

class TodoRepository
{
    /**
     * all
     *
     * @return array
     */
    public static function all()
    {
        $list = Todo::orderBy('time', 'asc')->get();
        return $list;
    }

    /**
    * @param int $id
    * @return mixed
    */
    public static function show(int $id)
    {
        return Todo::findOrFail($id);
    }

    /**
    * @param array $data
    * @return mixed
    */
    public static function store(array $data)
    {
        return Todo::create($data);
    }

    /**
    * @param array $data
    * @param int $id
    * @return mixed
    */
    public static function update(array $data, int $id)
    {
        $record = Todo::find($id);
        return $record->update($data);
    }

    /**
    * @param int $id
    * @return int
    */
    public static function delete(int $id)
    {
        return Todo::destroy($id);
    }
}
