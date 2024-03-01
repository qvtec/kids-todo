<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function getUploadImage($filename)
    {
        if (!auth()->check()) {
            abort(403, 'Unauthorized.');
        }

        $image = Storage::get('uploads/' . $filename);
        $type = Storage::mimeType($filename);
        return response($image, 200)->header('Content-Type', $type);
    }
}
