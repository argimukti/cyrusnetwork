<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->must_change_password) {
            if (! $request->routeIs('admin.profile', 'admin.profile.update', 'admin.profile.password', 'logout')) {
                return redirect()
                    ->route('admin.profile')
                    ->with('warning', 'Password Anda baru saja direset oleh Super Admin. Demi keamanan, wajib ganti dengan password baru terlebih dahulu sebelum mengakses menu lain.');
            }
        }

        return $next($request);
    }
}
