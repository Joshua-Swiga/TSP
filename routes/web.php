<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\players\users;
use App\Http\Controllers\Bonga;
use App\Http\Controllers\Games;
use App\Http\Controllers\messagesFunctionality;
use App\Http\Controllers\UserToken;
use App\Http\Controllers\Admin\paymentGateway;
// https://inertiajs.com/routing

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::any('FAQ', function () {
    return Inertia::render('FAQ');
})->name('FAQ');

Route::post('bonga', [Bonga::class, 'sendMessage'])->name('bonga');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('userssss', [Games::class, 'channelUsers_see']);

    
    Route::group(['prefix' => 'players'], function () {

        Route::get('/see-json', [Bonga::class, 'sendFirstNotificationToUser']);

    Route::get('/enable-notification', [users::class, 'enableNotificationForAuthUser']);
    Route::get('/inbox', [users::class, 'getGamesBelongingTouser']);
    });

    Route::group(['prefix' => 'otp'], function () {
        Route::post('/send', [users::class, 'sendOTP'])->name('otp.send');
        Route::post('/confirm', [users::class, 'confirmOTP'])->name('otp.confirm');
    });
        
    
    Route::group(['prefix' => 'tokens'], function () {
        Route::post('/send', [UserToken::class, 'transferTokensToAnotherPlayer'])->name('tokens.send');
        Route::post('/seeTokens/{userId}', [UserToken::class, 'getUserTokens'])->name('tokens.seeTokens');
    });

    Route::group(['prefix' => 'messages'], function () {
        Route::get('/game-portal', [messagesFunctionality::class, 'renderMessagePortal'])->name('messages.fetch');
        // JSON endpoint used by the frontend for polling new messages
        Route::get('/fetch', [messagesFunctionality::class, 'fetchMessage'])->name('messages.fetch.json');
        Route::post('/create', [messagesFunctionality::class, 'createMessage'])->name('messages.create');
        Route::get('/debug', function () {
            return response()->json([
                'auth_id' => auth()->id(),
                'csrf' => csrf_token(),
                'cookies' => request()->cookies->all(),
                'headers' => [
                    'referer' => request()->headers->get('referer')
                ]
            ]);
        });
        Route::post('/test-create', function () {
            $payload = request()->all();
            $debugPath = storage_path('logs/messages_debug.txt');
            file_put_contents($debugPath, date('Y-m-d H:i:s') . ' | test-create | payload=' . json_encode($payload) . PHP_EOL, FILE_APPEND | LOCK_EX);
            return response()->json(['ok' => true, 'received' => $payload]);
        });
    });

    Route::group(['prefix' => 'pay'], function(){
        Route::post('init', [paymentGateway::class, 'promptUserToMakePayment'])->name('pay.init');
        Route::get('callback', [paymentGateway::class, 'verifyPayment'])->name('pay.callback');
        Route::post('withdraw', [paymentGateway::class, 'withdrawTokens'])->name('pay.withdraw');

        Route::get('wif9A3Qx7mZ2RkL0pJH8WcU6TnS5E4BthdrawkL0pJH8WcU6als', [paymentGateway::class, 'withdrawals'])->name('pay.withdrawals');
        Route::get('siA6UmdJSTngK7xM2QW9FZP0LrE8H5C4nA6UmdJSTle-wingK7thdrawal-rehdraqet/{id}', [paymentGateway::class, 'singleWithdrawalRequest'])->name('pay.single-withdrawal-request');
        Route::put('siA6UmdJSTngK7xM2QW9FZP0LrE8H5C4nA6UmdJSTle-wingK7thdrawal-rehdraqet/{id}', [paymentGateway::class, 'updateWithdrawal'])->name('pay.update-withdrawal');
        Route::post('siA6UmdJSTngK7xM2QW9FZP0LrE8H5C4nA6UmdJSTle-wingK7thdrawal-rehdraqet/{id}/toggle-flag', [paymentGateway::class, 'toggleFlag'])->name('pay.toggle-flag');
        Route::get('download-withdrawal-pdf/{id}', [paymentGateway::class, 'downloadWithdrawalPDF'])->name('pay.download-withdrawal-pdf');
    });

    Route::group(['prefix' => 'games'], function () {
        Route::get('/view', [Games::class, 'index'])->name('games.create');
        Route::any('/join', [Games::class, 'joinGame'])->name('games.join');
        Route::any('games', [Games::class, 'store'])->name('games.store');
        Route::get('/lobby', [Games::class, 'seeLobby'])->name('games.lobby');
        Route::get('/filtered-games', [Games::class, 'getAllGamesMatchingSetCriteria'])->name('games.getAllGamesMatchingSetCriteria');
        Route::get('/game-preferences', [Games::class, 'displayGamePreferences'])->name('games.displayGamePreferences');
        Route::get('/end-game', [Games::class, 'endGame'])->name('games.endGame');
    });
    
    
    Route::get('game-won', function () {
        return Inertia::render('game-won');
    })->name('game-won');

    Route::get('game-lost', function () {
        return Inertia::render('game-lost');
    })->name('game-lost');

    Route::get('leading-board', function () {
        return Inertia::render('leading-board');
    })->name('leading-board');

    

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
