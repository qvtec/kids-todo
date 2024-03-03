<?php

namespace App\Repositories;

use Carbon\Carbon;
use App\Models\Check;

class CheckRepository
{
    /**
     * all
     *
     * @return array
     */
    public static function all()
    {
        $list = Check::all();
        return $list;
    }

    /**
     * search
     *
     * @param array $input
     * @return array
     */
    public static function search($input)
    {
        $now = new Carbon($input['date']);
        $data = Check::whereYear('date', $now->year)
                    ->whereMonth('date', $now->month)
                    ->get();
        return $data;
    }

    /**
    * @param string $date
    * @param string $type
    * @return mixed
    */
    public static function show(string $date, string $type)
    {
        return Check::whereDate('date', $date)->where('type', $type)->first();
    }

    /**
    * @param array $data
    * @return mixed
    */
    public static function store(array $data)
    {
        return Check::create($data);
    }

    /**
    * @param array $all
    * @param string $date
    * @return mixed
    */
    public static function update(array $all, string $date)
    {
        $type = $all['type'];
        $record = Check::whereDate('date', $date)->where('type', $type)->first();
        $data = [
            'date' => $date,
            'type' => $type,
            'todos' => $all['todos']
        ];
        return $record->update($data);
    }

    /**
    * @param array $data
    * @param string $date
    * @return mixed
    */
    public static function all_done(string $date)
    {
        $record = Check::whereDate('date', $date)->where('type', 'todo')->first();
        $now = Carbon::now();
        return $record->update([ 'all_done_at' => $now ]);
    }

    /**
    * @param string $date
    * @return int
    */
    public static function delete(string $date)
    {
        $record = Check::whereDate('date', $date)->first();
        return Check::destroy($record->id);
    }
}
