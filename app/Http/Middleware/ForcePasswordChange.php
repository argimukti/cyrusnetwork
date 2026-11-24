<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (
            $user &&
            $user->must_change_password &&
            ! $request->routeIs('admin.profile', 'admin.password.update', 'logout')
        ) {
            return redirect()
                ->route('admin.profile')
                ->with('error', 'Demi keamanan akun, Anda wajib mengganti password sementara sebelum mengakses menu lainnya.');
        }

        return $next($request);
    }
}
