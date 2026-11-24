<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Leader;
use App\Models\Service;
use App\Models\TrackRecord;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Akun Admin Default
        User::factory()->create([
            'name' => 'Admin Cyrus Network',
            'email' => 'admin@cyrusnetwork.id',
        ]);

        // 1. Pimpinan & Pendiri
        $leaders = [
            [
                'name' => 'Hasan Nasbi',
                'position' => 'Pendiri (Founder)',
                'bio' => 'Mendirikan Cyrus Network pada tahun 2010 di Jakarta Selatan sebagai lembaga konsultan politik, riset opini publik, dan komunikasi strategis.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Eko Prasetyo GT',
                'position' => 'Chief Executive Officer (CEO)',
                'bio' => 'Memimpin arah strategis korporasi dan pengembangan layanan konsultasi politik serta komunikasi publik di tingkat nasional.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Hafizhul Mizan Piliang',
                'position' => 'Direktur Eksekutif',
                'bio' => 'Mengawal riset opini publik, analisis lanskap politik nasional, serta memaparkan temuan strategis lembaga kepada publik dan media.',
                'sort_order' => 3,
            ],
        ];
        foreach ($leaders as $leader) {
            Leader::create($leader);
        }

        // 2. Layanan Utama
        $services = [
            [
                'title' => 'Riset & Analisis Opini Publik',
                'summary' => 'Survei kuantitatif dan kualitatif dengan metodologi terukur untuk memetakan preferensi pemilih dan isu kebijakan publik.',
                'description' => 'Kami merancang survei opini publik dengan penarikan sampel probabilistik yang ketat guna memberikan gambaran akurat mengenai elektabilitas, isu strategis, dan perilaku pemilih.',
                'icon' => 'chart',
                'sort_order' => 1,
            ],
            [
                'title' => 'Quick Count & Real Count Pemilu',
                'summary' => 'Sistem hitung cepat dan tabulasi suara presisi tinggi berbasis sampel TPS terdistribusi secara nasional maupun daerah.',
                'description' => 'Didukung jaringan relawan terlatih dan verifikasi berlapis untuk menyajikan proyeksi hasil pemilihan umum secara cepat dan akurat.',
                'icon' => 'check-circle',
                'sort_order' => 2,
            ],
            [
                'title' => 'Strategi Kampanye Digital & Manajemen Media Sosial',
                'summary' => 'Perencanaan narasi digital, analisis lanskap media, dan pengelolaan komunikasi terintegrasi lintas platform.',
                'description' => 'Mengoptimalkan distribusi pesan politik dan kebijakan publik melalui pemetaan sentimen media serta strategi kampanye digital berbasis data.',
                'icon' => 'megaphone',
                'sort_order' => 3,
            ],
            [
                'title' => 'Government Relations & Public Affairs',
                'summary' => 'Konsultasi kebijakan publik dan jembatan komunikasi strategis antara pemangku kepentingan, pemerintah, dan masyarakat.',
                'description' => 'Mendampingi institusi dalam membaca dinamika regulasi, memitigasi risiko reputasi, serta membangun hubungan kelembagaan yang konstruktif.',
                'icon' => 'building',
                'sort_order' => 4,
            ],
        ];
        foreach ($services as $service) {
            Service::create([
                ...$service,
                'slug' => Str::slug($service['title']),
            ]);
        }

        // 3. Rekam Jejak Pemilu
        TrackRecord::create([
            'title' => 'Quick Count Pemilihan Presiden 2024',
            'year' => '2024',
            'partner' => 'CSIS Indonesia',
            'sample_info' => '2.000 TPS di 38 Provinsi',
            'accuracy_note' => 'Selisih 0,25% dari Rekapitulasi Resmi KPU',
            'description' => 'Kolaborasi riset dan hitung cepat nasional bersama CSIS Indonesia menggunakan metodologi multistage random sampling di seluruh Indonesia dengan tingkat akurasi tinggi.',
        ]);

        // 4. Berita, Analisis & Arsip Media
        $articles = [
            [
                'title' => 'Pandangan Cyrus Network Terkait Rekam Jejak Sufmi Dasco Ahmad dalam Konstelasi Nasional',
                'category' => 'Sorotan Politik',
                'source_name' => 'Kumparan',
                'external_link' => 'https://kumparan.com',
                'excerpt' => 'Direktur Eksekutif Cyrus Network, Hafizhul Mizan Piliang, menilai Wakil Ketua DPR Sufmi Dasco Ahmad memiliki rekam jejak relevan sebagai figur wakil presiden.',
                'content' => 'Direktur Eksekutif Cyrus Network, Hafizhul Mizan Piliang, menilai Wakil Ketua DPR Sufmi Dasco Ahmad memiliki rekam jejak yang relevan sebagai figur wakil presiden untuk menjembatani kepentingan politik dan aspirasi publik di tengah dinamika pemerintahan.',
                'published_at' => '2026-11-15',
            ],
            [
                'title' => 'Jejak Langkah Cyrus Network dalam Peta Lembaga Riset dan Konsultan Politik Indonesia',
                'category' => 'Arsip Pemberitaan',
                'source_name' => 'Tempo',
                'external_link' => 'https://tempo.co',
                'excerpt' => 'Kilas balik perjalanan dan dinamika operasional Cyrus Network sejak berdiri pada 2010 di Jakarta Selatan.',
                'content' => 'Sejak didirikan pada 2010 oleh Hasan Nasbi di Jakarta Selatan, Cyrus Network terus menjadi bagian penting dalam dinamika riset opini publik, strategi pemenangan pemilu, dan analisis kebijakan di Indonesia.',
                'published_at' => '2025-08-20',
            ],
        ];
        foreach ($articles as $article) {
            Article::create([
                ...$article,
                'slug' => Str::slug($article['title']),
            ]);
        }
    }
}
