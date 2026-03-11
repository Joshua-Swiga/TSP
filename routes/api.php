<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Bonga;
use App\Http\Controllers\players\users;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('bonga', [Bonga::class, 'sendMessage'])->name('bonga');

Route::group(['prefix' => 'notifications'], function () {
        Route::get('/see-json', [users::class, 'see']);
        Route::get('/enable-notification', [users::class, 'enableNotificationForAuthUser']);
    });
