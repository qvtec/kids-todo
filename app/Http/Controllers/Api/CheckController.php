<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\CheckRepository;
use Illuminate\Http\Request;
use App\Services\Slack\SlackFacade as Slack;

class CheckController extends Controller
{
    /**
     * カレンダー用にチェックの一覧を取得
     */
    public function index(Request $request)
    {
        $input = $request->all();
        $data = CheckRepository::search($input);
        return response()->json($data);
    }

    /**
     * 今日のチェック取得
     */
    public function show(Request $request, string $date)
    {
        $type = $request->input('type');
        $data = CheckRepository::show($date, $type);
        if (!$data) {
            $insert = [
                'date' => $date,
                'type' => $type,
                'todos' => []
            ];
            $data = CheckRepository::store($insert);
        }
        return response()->json($data->todos);
    }

    /**
     * 今日のタスク表示時にデータがなければ追加
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $data = CheckRepository::store($input);
        return response()->json($data, 201);
    }

    /**
     * 今日のチェック更新
     */
    public function update(Request $request, string $date)
    {
        $all_done = $request->input('all_done');
        if ($all_done) {
            $res = CheckRepository::all_done($date);
            Slack::send("できた！");
            return response()->json($res);
        }

        $all = $request->all();
        $res = CheckRepository::update($all, $date);
        return response()->json($res);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $date)
    {
        CheckRepository::delete($date);
        return response()->json(null, 204);
    }
}
