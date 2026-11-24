<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PublicController;
use App\Models\Article;
use Illuminate\Support\Facades\Route;

// ================= HALAMAN PUBLIK =================
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/tentang-kami', [PublicController::class, 'about'])->name('about');
Route::get('/layanan', [PublicController::class, 'services'])->name('services');
Route::get('/publikasi', [PublicController::class, 'publications'])->name('publications');
Route::get('/publikasi/{slug}', [PublicController::class, 'publicationDetail'])->name('publications.detail');
Route::get('/kontak', [PublicController::class, 'contact'])->name('contact');
Route::post('/kontak', [PublicController::class, 'storeInquiry'])
    ->middleware('throttle:contact-form')
    ->name('contact.store');

// ================= SITEMAP XML =================
Route::get('/sitemap.xml', function () {
    $articles = Article::where('status', 'published')
        ->orderByDesc('published_at')
        ->select(['slug', 'updated_at', 'published_at'])
        ->get();

    $staticUrls = [
        ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        ['loc' => url('/tentang-kami'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => url('/layanan'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => url('/publikasi'), 'priority' => '0.9', 'changefreq' => 'daily'],
        ['loc' => url('/kontak'), 'priority' => '0.7', 'changefreq' => 'monthly'],
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($staticUrls as $item) {
        $xml .= "  <url>\n";
        $xml .= '    <loc>' . htmlspecialchars($item['loc'], ENT_XML1) . "</loc>\n";
        $xml .= "    <changefreq>{$item['changefreq']}</changefreq>\n";
        $xml .= "    <priority>{$item['priority']}</priority>\n";
        $xml .= "  </url>\n";
    }

    foreach ($articles as $article) {
        $lastmod = optional($article->updated_at ?? $article->published_at)->toAtomString();
        $xml .= "  <url>\n";
        $xml .= '    <loc>' . htmlspecialchars(url('/publikasi/' . $article->slug), ENT_XML1) . "</loc>\n";
        if ($lastmod) {
            $xml .= '    <lastmod>' . htmlspecialchars($lastmod, ENT_XML1) . "</lastmod>\n";
        }
        $xml .= "    <changefreq>weekly</changefreq>\n";
        $xml .= "    <priority>0.8</priority>\n";
        $xml .= "  </url>\n";
    }

    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
})->name('sitemap');

// ================= PANEL INTERNAL / ADMIN =================
Route::middleware(['auth', 'force.password.change'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/admin', fn() => redirect()->route('dashboard'));

    // Profil & ubah password mandiri (semua role)
    Route::get('/admin/profile', [AdminController::class, 'profile'])->name('admin.profile');
    Route::patch('/admin/profile', [AdminController::class, 'updateProfile'])->name('admin.profile.update');
    Route::patch('/admin/password', [AdminController::class, 'updatePassword'])->name('admin.password.update');

    // Pesan masuk (admin & humas)
    Route::middleware('role:admin,humas')->group(function () {
        Route::patch('/admin/inquiries/{inquiry}/read', [AdminController::class, 'markInquiryRead'])->name('admin.inquiries.read');
        Route::delete('/admin/inquiries/{inquiry}', [AdminController::class, 'destroyInquiry'])->name('admin.inquiries.destroy');
    });

    // Publikasi & riset (admin, leader, peneliti)
    Route::middleware('role:admin,leader,peneliti')->group(function () {
        Route::get('/admin/articles', [AdminController::class, 'articles'])->name('admin.articles');
        Route::post('/admin/articles', [AdminController::class, 'storeArticle'])->name('admin.articles.store');
        Route::put('/admin/articles/{article}', [AdminController::class, 'updateArticle'])->name('admin.articles.update');
        Route::delete('/admin/articles/{article}', [AdminController::class, 'destroyArticle'])->name('admin.articles.destroy');
    });

    // Approval publikasi (admin & leader)
    Route::middleware('role:admin,leader')->group(function () {
        Route::patch('/admin/articles/{article}/approve', [AdminController::class, 'approveArticle'])->name('admin.articles.approve');
        Route::patch('/admin/articles/{article}/reject', [AdminController::class, 'rejectArticle'])->name('admin.articles.reject');
    });

    // Pimpinan, layanan, rekam jejak (admin & humas)
    Route::middleware('role:admin,humas')->group(function () {
        Route::get('/admin/leaders', [AdminController::class, 'leaders'])->name('admin.leaders');
        Route::post('/admin/leaders', [AdminController::class, 'storeLeader'])->name('admin.leaders.store');
        Route::put('/admin/leaders/{leader}', [AdminController::class, 'updateLeader'])->name('admin.leaders.update');
        Route::delete('/admin/leaders/{leader}', [AdminController::class, 'destroyLeader'])->name('admin.leaders.destroy');

        Route::get('/admin/services', [AdminController::class, 'services'])->name('admin.services');
        Route::post('/admin/services', [AdminController::class, 'storeService'])->name('admin.services.store');
        Route::put('/admin/services/{service}', [AdminController::class, 'updateService'])->name('admin.services.update');
        Route::delete('/admin/services/{service}', [AdminController::class, 'destroyService'])->name('admin.services.destroy');

        Route::get('/admin/track-records', [AdminController::class, 'trackRecords'])->name('admin.track-records');
        Route::post('/admin/track-records', [AdminController::class, 'storeTrackRecord'])->name('admin.track-records.store');
        Route::put('/admin/track-records/{trackRecord}', [AdminController::class, 'updateTrackRecord'])->name('admin.track-records.update');
        Route::delete('/admin/track-records/{trackRecord}', [AdminController::class, 'destroyTrackRecord'])->name('admin.track-records.destroy');
    });

    // Kelola pengguna & level (khusus admin)
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users');
        Route::post('/admin/users', [AdminController::class, 'storeUser'])->name('admin.users.store');
        Route::patch('/admin/users/{user}/role', [AdminController::class, 'updateUserRole'])->name('admin.users.role');
        Route::patch('/admin/users/{user}/password', [AdminController::class, 'resetUserPassword'])->name('admin.users.password');
        Route::delete('/admin/users/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');
    });
});
