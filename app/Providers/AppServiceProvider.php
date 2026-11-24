<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! App::isProduction());

        // Maksimal 5 pesan kontak per jam per alamat IP
        RateLimiter::for('contact-form', function (Request $request) {
            return Limit::perHour(5)
                ->by($request->ip())
                ->response(function () {
                    return back()->withErrors([
                        'message' => 'Batas pengiriman pesan tercapai (maksimal 5 pesan per jam). Silakan coba kembali beberapa saat lagi.',
                    ]);
                });
        });

        // Maksimal 3 permintaan reset password per 15 menit per email/IP
        RateLimiter::for('password-reset', function (Request $request) {
            $key = strtolower((string) $request->input('email')) . '|' . $request->ip();

            return Limit::perMinutes(15, 3)
                ->by($key)
                ->response(function () {
                    return back()->withErrors([
                        'email' => 'Terlalu banyak permintaan reset password. Silakan tunggu 15 menit sebelum mencoba lagi.',
                    ]);
                });
        });
    }
}
