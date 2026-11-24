<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'author',
        'category',
        'source_name',
        'external_link',
        'thumbnail',
        'chart_title',
        'sample_size',
        'chart_data',
        'excerpt',
        'content',
        'published_at',
        'status',
        'rejection_note',
        'approved_by',
    ];

    protected function casts(): array
    {
        return [
            'chart_data' => 'array',
            'published_at' => 'datetime',
        ];
    }
}
