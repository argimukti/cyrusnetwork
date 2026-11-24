<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Permintaan Konsultasi Baru</title>
</head>
<body style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 18px 24px;">
            <strong style="letter-spacing: 1px; font-size: 13px; color: #f87171;">CYRUS NETWORK</strong>
            <h2 style="margin: 4px 0 0; font-size: 18px;">Permintaan Konsultasi / Pesan Kontak Baru</h2>
        </div>

        <div style="padding: 24px;">
            <p style="margin-top: 0;">Ada pesan baru masuk melalui formulir kontak website Cyrus Network:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                <tr>
                    <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Nama</strong></td>
                    <td style="padding: 8px 0;">{{ $inquiry->name }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Lembaga / Instansi</strong></td>
                    <td style="padding: 8px 0;">{{ $inquiry->institution ?: '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Email</strong></td>
                    <td style="padding: 8px 0;">{{ $inquiry->email }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Telepon / WA</strong></td>
                    <td style="padding: 8px 0;">{{ $inquiry->phone ?: '-' }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Topik Layanan</strong></td>
                    <td style="padding: 8px 0;"><strong>{{ $inquiry->service_type }}</strong></td>
                </tr>
            </table>

            <div style="background: #f1f5f9; padding: 14px 16px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-size: 12px; font-weight: bold; color: #475569; margin-bottom: 6px;">ISI PESAN:</div>
                <div style="white-space: pre-line; font-size: 14px;">{{ $inquiry->message }}</div>
            </div>

            <a href="{{ url('/dashboard') }}" style="display: inline-block; background: #b91c1c; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: bold;">
                Buka Dashboard Internal
            </a>
        </div>
    </div>
</body>
</html>
