<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\MoneyRepository;

class MoneyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list = MoneyRepository::all();
        return response()->json($list);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $data = MoneyRepository::show($id);
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $all = $request->all();
        $data = MoneyRepository::store($all);
        return response()->json($data, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $all = $request->all();
        $data = MoneyRepository::update($id, $all);
        return response()->json($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        MoneyRepository::delete($id);
        return response()->json(null, 204);
    }
}
