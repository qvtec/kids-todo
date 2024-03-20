<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\StudyMasterRepository;
use Illuminate\Http\Request;

class StudyMasterController extends Controller
{
    /**
     * テスト一覧
     */
    public function index()
    {
        $data = StudyMasterRepository::search();
        return $data;
    }

    /**
     * テスト詳細
     */
    public function show(string $id)
    {
        $data = StudyMasterRepository::show($id);
        return $data;
    }

    /**
     * テスト追加
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $data = StudyMasterRepository::store($data);
        return response()->json($data, 201);
    }

    /**
     * テスト更新
     */
    public function update(Request $request, int $id)
    {
        $data = $request->all();
        $data = StudyMasterRepository::update($data, $id);
        return response()->json($data);
    }

    /**
     * テスト削除
     */
    public function destroy(int $id)
    {
        StudyMasterRepository::delete($id);
        return response()->json(null, 204);
    }
}
