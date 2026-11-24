<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('content');
            $table->text('rejection_note')->nullable()->after('status');
            $table->string('approved_by')->nullable()->after('rejection_note');
        });

        // Pastikan artikel lama yang sudah ada tetap berstatus tayang
        DB::table('articles')->update(['status' => 'published']);
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['status', 'rejection_note', 'approved_by']);
        });
    }
};
