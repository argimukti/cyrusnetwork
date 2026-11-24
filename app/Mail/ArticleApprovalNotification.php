<?php

namespace App\Mail;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ArticleApprovalNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Article $article,
        public string $decision, // 'approved' atau 'rejected'
        public string $reviewerName
    ) {}

    public function envelope(): Envelope
    {
        $prefix = $this->decision === 'approved'
            ? '[Disetujui & Tayang]'
            : '[Perlu Revisi]';

        return new Envelope(
            subject: "{$prefix} Publikasi: {$this->article->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.article-approval',
        );
    }
}
