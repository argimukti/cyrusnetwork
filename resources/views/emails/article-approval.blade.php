<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Status Persetujuan Publikasi</title>
</head>
<body style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 18px 24px;">
            <strong style="letter-spacing: 1px; font-size: 13px; color: #f87171;">CYRUS NETWORK</strong>
            <h2 style="margin: 4px 0 0; font-size: 18px;">
                @if ($decision === 'approved')
                    Naskah Publikasi Disetujui &amp; Tayang
                @else
                    Naskah Publikasi Dikembalikan (Perlu Revisi)
                @endif
            </h2>
        </div>

        <div style="padding: 24px;">
            <p style="margin-top: 0;">
                Peninjau <strong>{{ $reviewerName }}</strong> telah memproses naskah publikasi berikut:
            </p>

            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin: 16px 0; background: #f8fafc;">
                <div style="font-size: 12px; color: #b91c1c; font-weight: bold; text-transform: uppercase;">
                    {{ $article->category }}
                </div>
                <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 4px;">
                    {{ $article->title }}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                    Penulis: <strong>{{ $article->author }}</strong>
                </div>
            </div>

            @if ($decision === 'rejected' && $article->rejection_note)
                <div style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 14px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
                    <strong>Catatan Revisi:</strong><br>
                    {{ $article->rejection_note }}
                </div>
            @endif

            <a href="{{ url('/admin/articles') }}" style="display: inline-block; background: #b91c1c; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: bold;">
                Buka Menu Publikasi &amp; Riset
            </a>
        </div>
    </div>
</body>
</html>
