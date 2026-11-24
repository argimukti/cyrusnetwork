<?php

namespace App\Http\Controllers;

use App\Mail\ArticleApprovalNotification;
use App\Models\Article;
use App\Models\Inquiry;
use App\Models\Leader;
use App\Models\Service;
use App\Models\TrackRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    // ================= DASHBOARD =================
    public function dashboard(Request $request)
    {
        $role = $request->user()->role;
        $canViewInquiries = in_array($role, ['admin', 'humas']);
        $canApprove = in_array($role, ['admin', 'leader']);

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'articles_count' => Article::where('status', 'published')->count(),
                'pending_articles' => Article::where('status', 'pending')->count(),
                'services_count' => Service::count(),
                'unread_inquiries' => $canViewInquiries ? Inquiry::where('is_read', false)->count() : 0,
            ],
            'inquiries' => $canViewInquiries ? Inquiry::latest()->get() : [],
            'pendingArticles' => $canApprove
                ? Article::where('status', 'pending')->orderByDesc('created_at')->get()
                : [],
        ]);
    }

    public function markInquiryRead(Inquiry $inquiry)
    {
        $inquiry->update(['is_read' => true]);

        return back()->with('success', 'Pesan ditandai sudah dibaca.');
    }

    public function destroyInquiry(Inquiry $inquiry)
    {
        $inquiry->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }

    // ================= PROFIL & UBAH PASSWORD (SEMUA LEVEL) =================
    public function profile()
    {
        return Inertia::render('admin/Profile');
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        $user->update($validated);

        return back()->with('success', 'Informasi profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.current_password' => 'Password saat ini tidak sesuai.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
            'must_change_password' => false,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Password baru berhasil disimpan. Seluruh menu akun Anda kini telah aktif kembali.');
    }

    // ================= PUBLIKASI & RISET =================
    public function articles(Request $request)
    {
        $status = (string) $request->input('status', 'all');
        $search = trim((string) $request->input('search', ''));

        $query = Article::query();

        if (in_array($status, ['pending', 'published', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/Articles', [
            'articles' => $query
                ->orderByRaw("CASE WHEN status = 'pending' THEN 0 WHEN status = 'rejected' THEN 1 ELSE 2 END")
                ->orderByDesc('published_at')
                ->paginate(10)
                ->withQueryString(),
            'counts' => [
                'all' => Article::count(),
                'pending' => Article::where('status', 'pending')->count(),
                'published' => Article::where('status', 'published')->count(),
                'rejected' => Article::where('status', 'rejected')->count(),
            ],
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function storeArticle(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:150',
            'category' => 'required|string|max:100',
            'source_name' => 'nullable|string|max:100',
            'external_link' => 'nullable|url|max:255',
            'thumbnail' => 'nullable|image|max:2048',
            'chart_title' => 'nullable|string|max:255',
            'sample_size' => 'nullable|string|max:255',
            'chart_data' => 'nullable|array',
            'chart_data.*.label' => 'required|string|max:100',
            'chart_data.*.value' => 'required|numeric|min:0|max:100',
            'chart_data.*.color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'excerpt' => 'required|string|max:1000',
            'content' => 'required|string|max:50000',
            'published_at' => 'required|date',
        ], [
            'chart_data.*.color.regex' => 'Format warna grafik harus berupa kode hex 6 digit (contoh: #b91c1c).',
        ]);

        $slug = Str::slug($validated['title']);
        if (Article::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::lower(Str::random(4));
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('articles', 'public');
        }

        $user = $request->user();
        $isApprover = in_array($user->role, ['admin', 'leader']);

        Article::create([
            ...$validated,
            'slug' => $slug,
            'thumbnail' => $thumbnailPath,
            'chart_data' => ! empty($validated['chart_data']) ? $validated['chart_data'] : null,
            'status' => $isApprover ? 'published' : 'pending',
            'approved_by' => $isApprover ? $user->name : null,
            'rejection_note' => null,
        ]);

        $message = $isApprover
            ? 'Hasil riset / publikasi berhasil diterbitkan ke website.'
            : 'Naskah berhasil dikirim dan menunggu persetujuan (approval) Leader.';

        return back()->with('success', $message);
    }

    public function updateArticle(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:150',
            'category' => 'required|string|max:100',
            'source_name' => 'nullable|string|max:100',
            'external_link' => 'nullable|url|max:255',
            'thumbnail' => 'nullable|image|max:2048',
            'chart_title' => 'nullable|string|max:255',
            'sample_size' => 'nullable|string|max:255',
            'chart_data' => 'nullable|array',
            'chart_data.*.label' => 'required|string|max:100',
            'chart_data.*.value' => 'required|numeric|min:0|max:100',
            'chart_data.*.color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'excerpt' => 'required|string|max:1000',
            'content' => 'required|string|max:50000',
            'published_at' => 'required|date',
        ], [
            'chart_data.*.color.regex' => 'Format warna grafik harus berupa kode hex 6 digit (contoh: #b91c1c).',
        ]);

        $thumbnailPath = $article->thumbnail;
        if ($request->hasFile('thumbnail')) {
            if ($article->thumbnail) {
                Storage::disk('public')->delete($article->thumbnail);
            }
            $thumbnailPath = $request->file('thumbnail')->store('articles', 'public');
        }

        $user = $request->user();
        $updatePayload = [
            ...$validated,
            'thumbnail' => $thumbnailPath,
            'chart_data' => ! empty($validated['chart_data']) ? $validated['chart_data'] : null,
        ];

        if ($user->role === 'peneliti') {
            $updatePayload['status'] = 'pending';
            $updatePayload['rejection_note'] = null;
            $updatePayload['approved_by'] = null;
        }

        $article->update($updatePayload);

        $message = $user->role === 'peneliti'
            ? 'Perubahan disimpan dan diajukan ulang untuk persetujuan Leader.'
            : 'Publikasi berhasil diperbarui.';

        return back()->with('success', $message);
    }

    public function approveArticle(Request $request, Article $article)
    {
        $reviewerName = $request->user()->name;

        $article->update([
            'status' => 'published',
            'rejection_note' => null,
            'approved_by' => $reviewerName,
        ]);

        $researchers = User::where('role', 'peneliti')->pluck('email')->filter()->all();
        if (! empty($researchers)) {
            Mail::to($researchers)->send(new ArticleApprovalNotification($article, 'approved', $reviewerName));
        }

        return back()->with('success', "Publikasi \"{$article->title}\" telah disetujui dan tayang di website.");
    }

    public function rejectArticle(Request $request, Article $article)
    {
        $validated = $request->validate([
            'rejection_note' => 'required|string|min:5|max:500',
        ]);

        $reviewerName = $request->user()->name;

        $article->update([
            'status' => 'rejected',
            'rejection_note' => $validated['rejection_note'],
            'approved_by' => null,
        ]);

        $researchers = User::where('role', 'peneliti')->pluck('email')->filter()->all();
        if (! empty($researchers)) {
            Mail::to($researchers)->send(new ArticleApprovalNotification($article, 'rejected', $reviewerName));
        }

        return back()->with('success', 'Publikasi dikembalikan ke penulis dengan catatan revisi.');
    }

    public function destroyArticle(Article $article)
    {
        if ($article->thumbnail) {
            Storage::disk('public')->delete($article->thumbnail);
        }

        $article->delete();

        return back()->with('success', 'Publikasi berhasil dihapus.');
    }

    // ================= PIMPINAN & DIREKSI =================
    public function leaders()
    {
        return Inertia::render('admin/Leaders', [
            'leaders' => Leader::orderBy('sort_order')->get(),
        ]);
    }

    public function storeLeader(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'bio' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'sort_order' => 'required|integer|min:0',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('leaders', 'public');
        }

        Leader::create([
            ...$validated,
            'photo' => $photoPath,
        ]);

        return back()->with('success', 'Profil pimpinan berhasil ditambahkan.');
    }

    public function updateLeader(Request $request, Leader $leader)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'bio' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'sort_order' => 'required|integer|min:0',
        ]);

        $photoPath = $leader->photo;
        if ($request->hasFile('photo')) {
            if ($leader->photo) {
                Storage::disk('public')->delete($leader->photo);
            }
            $photoPath = $request->file('photo')->store('leaders', 'public');
        }

        $leader->update([
            ...$validated,
            'photo' => $photoPath,
        ]);

        return back()->with('success', 'Profil pimpinan berhasil diperbarui.');
    }

    public function destroyLeader(Leader $leader)
    {
        if ($leader->photo) {
            Storage::disk('public')->delete($leader->photo);
        }

        $leader->delete();

        return back()->with('success', 'Profil pimpinan berhasil dihapus.');
    }

    // ================= LAYANAN =================
    public function services()
    {
        return Inertia::render('admin/Services', [
            'services' => Service::orderBy('sort_order')->get(),
        ]);
    }

    public function storeService(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'description' => 'required|string',
            'sort_order' => 'required|integer|min:0',
        ]);

        $slug = Str::slug($validated['title']);
        if (Service::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::lower(Str::random(4));
        }

        Service::create([
            ...$validated,
            'slug' => $slug,
        ]);

        return back()->with('success', 'Layanan baru berhasil ditambahkan.');
    }

    public function updateService(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'description' => 'required|string',
            'sort_order' => 'required|integer|min:0',
        ]);

        $service->update($validated);

        return back()->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroyService(Service $service)
    {
        $service->delete();

        return back()->with('success', 'Layanan berhasil dihapus.');
    }

    // ================= REKAM JEJAK PEMILU =================
    public function trackRecords()
    {
        return Inertia::render('admin/TrackRecords', [
            'trackRecords' => TrackRecord::latest()->get(),
        ]);
    }

    public function storeTrackRecord(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'year' => 'required|string|max:20',
            'partner' => 'nullable|string|max:255',
            'sample_info' => 'required|string|max:255',
            'accuracy_note' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        TrackRecord::create($validated);

        return back()->with('success', 'Rekam jejak baru berhasil ditambahkan.');
    }

    public function updateTrackRecord(Request $request, TrackRecord $trackRecord)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'year' => 'required|string|max:20',
            'partner' => 'nullable|string|max:255',
            'sample_info' => 'required|string|max:255',
            'accuracy_note' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $trackRecord->update($validated);

        return back()->with('success', 'Rekam jejak berhasil diperbarui.');
    }

    public function destroyTrackRecord(TrackRecord $trackRecord)
    {
        $trackRecord->delete();

        return back()->with('success', 'Rekam jejak berhasil dihapus.');
    }

    // ================= KELOLA PENGGUNA & LEVEL (KHUSUS ADMIN) =================
    public function users(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $query = User::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/Users', [
            'users' => $query
                ->orderBy('id')
                ->select(['id', 'name', 'email', 'role', 'must_change_password', 'created_at'])
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['admin', 'leader', 'peneliti', 'humas'])],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'must_change_password' => true,
        ]);

        return back()->with('success', 'Akun pengguna baru berhasil dibuat. Pengguna akan diminta mengganti password saat login pertama.');
    }

    public function updateUserRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'leader', 'peneliti', 'humas'])],
        ]);

        if ($request->user()->id === $user->id && $validated['role'] !== 'admin') {
            return back()->with('success', 'Anda tidak dapat menurunkan level akun Anda sendiri.');
        }

        $user->update(['role' => $validated['role']]);

        return back()->with('success', 'Level pengguna berhasil diperbarui.');
    }

    public function resetUserPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6',
        ], [
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password baru minimal 6 karakter.',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
            'must_change_password' => true,
        ]);

        return back()->with('success', "Password sementara untuk {$user->name} ({$user->email}) berhasil disimpan. Staf wajib menggantinya saat login berikutnya.");
    }

    public function destroyUser(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return back()->with('success', 'Akun yang sedang digunakan tidak dapat dihapus.');
        }

        $user->delete();

        return back()->with('success', 'Akun pengguna berhasil dihapus.');
    }
}
