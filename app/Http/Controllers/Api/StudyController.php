<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\StudyRepository;
use Illuminate\Http\Request;

class StudyController extends Controller
{
    /**
     * テスト一覧
     */
    public function subject()
    {
        $data = StudyRepository::search();
        return $data;
    }

    /**
     * 問題一覧
     */
    public function question(int $study_test_id)
    {
        $data = StudyRepository::questions($study_test_id);
        return $data;
    }

    /**
     * テスト完了
     */
    public function answer(Request $request)
    {
        $data = $request->all();
        return StudyRepository::answer($data);
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = StudyRepository::all();
        return $data;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $data = StudyRepository::store($data);
        return response()->json($data, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $data = StudyRepository::show($id);
        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $data = $request->all();
        $data = StudyRepository::update($data, $id);
        return response()->json($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $data = StudyRepository::delete($id);
        return response()->json($data, 204);
    }
}
