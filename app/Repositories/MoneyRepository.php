<?php

namespace App\Repositories;

use App\Models\Money;

class MoneyRepository
{
    /**
     * all
     *
     * @return array
     */
    public static function all()
    {
        $list = Money::orderBy('date', 'desc')->orderBy('id', 'desc')->paginate(10);
        return $list;
    }

    /**
    * @param int $id
    * @return mixed
    */
    public static function show(int $id)
    {
        // return Money::show($id);
        return floor(Money::sum('amount'));
    }

    /**
    * @param array $data
    * @return mixed
    */
    public static function store(array $data)
    {
        return Money::create($data);
    }

    /**
    * @param int $id
    * @param array $date
    * @return mixed
    */
    public static function update(int $id, array $data)
    {
        $record = Money::find($id);
        return $record->update($data);
    }

    /**
    * @param int $id
    * @return int
    */
    public static function delete(int $id)
    {
        return Money::destroy($id);
    }
}
