<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\Slack\SlackFacade as Slack;

class GoogleLoginController extends Controller
{
    /**
     * Display the login view.
     */
    public function login(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $socialiteUser = Socialite::driver('google')->user();
            $email = $socialiteUser->email;

            $user = User::firstOrCreate(['email' => $email], [
                'name' => $socialiteUser->name,
            ]);

            Slack::send("ログインしました: {$user->name}<{$user->email}>");

            if ($user->role) {
                Auth::login($user);
                return redirect()->intended(RouteServiceProvider::HOME);
            } else {
                Auth::logout();
                return redirect('/login')->with('status', 'pending');
            }
        } catch (Exception $e) {
            Log::error($e);
            throw $e;
        }
    }
}

