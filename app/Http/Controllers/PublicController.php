<?php

namespace App\Http\Controllers;

use App\Mail\NewInquiryNotification;
use App\Models\Article;
use App\Models\Inquiry;
use App\Models\Leader;
use App\Models\Service;
use App\Models\TrackRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('Home', [
            'services' => Service::orderBy('sort_order')->get(),
            'trackRecords' => TrackRecord::latest()->get(),
            'articles' => Article::where('status', 'published')
                ->orderByDesc('published_at')
                ->take(3)
                ->get(),
            'leaders' => Leader::orderBy('sort_order')->get(),
            'featuredSurvey' => Article::where('status', 'published')
                ->whereNotNull('chart_data')
                ->orderByDesc('published_at')
                ->first(),
        ]);
    }

    public function about()
    {
        return Inertia::render('About', [
            'leaders' => Leader::orderBy('sort_order')->get(),
            'trackRecords' => TrackRecord::latest()->get(),
        ]);
    }

    public function services()
    {
        return Inertia::render('Services', [
            'services' => Service::orderBy('sort_order')->get(),
        ]);
    }

    public function publications(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $category = trim((string) $request->input('category', ''));

        $query = Article::where('status', 'published');

        if ($category !== '' && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Publications', [
            'articles' => $query->orderByDesc('published_at')
                ->paginate(9)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
                'category' => $category ?: 'all',
            ],
        ]);
    }

    public function publicationDetail(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('PublicationDetail', [
            'article' => $article,
            'seo' => [
                'title' => $article->title . ' — Cyrus Network',
                'description' => \Illuminate\Support\Str::limit(strip_tags($article->excerpt), 160),
                'image' => $article->thumbnail
                    ? url('/storage/' . $article->thumbnail)
                    : url('/images/logo-cyrus.png'),
                'url' => url('/publikasi/' . $article->slug),
            ],
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact', [
            'services' => Service::orderBy('sort_order')->get(['id', 'title']),
        ]);
    }

    public function storeInquiry(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'institution' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]+$/'],
            'service_type' => 'required|string|max:255',
            'message' => 'required|string|min:10|max:5000',
        ], [
            'phone.regex' => 'Format nomor telepon / WhatsApp tidak valid.',
        ]);

        $inquiry = Inquiry::create($validated);

        $recipients = User::whereIn('role', ['admin', 'humas'])->pluck('email')->filter()->all();
        if (! empty($recipients)) {
            Mail::to($recipients)->send(new NewInquiryNotification($inquiry));
        }

        return back()->with('success', 'Terima kasih. Pesan dan permintaan konsultasi Anda telah diterima oleh tim Cyrus Network.');
    }
}
