<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ $statusLabel }}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f3ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3ef; padding: 32px 16px;">
<tr>
<td align="center">

<table role="presentation" width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

    {{-- Wordmark --}}
    <tr>
        <td style="padding-bottom:24px;">
            <span style="font-size:15px; font-weight:700; color:#1a1a18; letter-spacing:-0.2px;">
                Tukang<span style="color:#2f7a4f;">Perak</span>
            </span>
        </td>
    </tr>

    {{-- Card --}}
    <tr>
        <td style="background-color:#ffffff; border:1px solid #e8e6df; border-radius:10px; overflow:hidden;">

            {{-- Status strip --}}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="background-color:#2f7a4f; height:4px; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:28px 28px 24px;">
                <tr>
                    <td>
                        <p style="margin:0 0 4px; font-size:12px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase; color:#2f7a4f;">
                            Tempahan #{{ $booking->id }}
                        </p>
                        <h1 style="margin:0 0 20px; font-size:20px; line-height:1.3; color:#1a1a18; font-weight:700;">
                            {{ $statusLabel }}
                        </h1>

                        {{-- Details block --}}
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f8f5; border-radius:8px; margin-bottom: {{ $extraNote ? '16' : '24' }}px;">
                            <tr>
                                <td style="padding:16px 18px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; color:#55534c;">
                                        <tr>
                                            <td style="padding:3px 0; width:90px; color:#8a8778;">Perkhidmatan</td>
                                            <td style="padding:3px 0; font-weight:600; color:#1a1a18;">{{ $booking->service->title }}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:3px 0; color:#8a8778;">
                                                {{ $recipientRole === 'customer' ? 'Tukang' : 'Pelanggan' }}
                                            </td>
                                            <td style="padding:3px 0; font-weight:600; color:#1a1a18;">
                                                {{ $recipientRole === 'customer' ? $booking->providerProfile->user->name : $booking->customer->name }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:3px 0; color:#8a8778;">Tarikh</td>
                                            <td style="padding:3px 0; font-weight:600; color:#1a1a18;">{{ $booking->preferred_date->format('d M Y') }}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        @if($extraNote)
                        <p style="margin:0 0 24px; font-size:13px; line-height:1.6; color:#6b6959;">
                            {{ $extraNote }}
                        </p>
                        @endif

                        {{-- CTA --}}
                        <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="border-radius:7px; background-color:#2f7a4f;">
                                    <a href="{{ route($recipientRole === 'customer' ? 'customer.bookings.show' : 'provider.bookings.show', $booking) }}"
                                       style="display:inline-block; padding:11px 22px; font-size:13px; font-weight:600; color:#ffffff; text-decoration:none;">
                                        Lihat Tempahan →
                                    </a>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>
        </td>
    </tr>

    {{-- Footer --}}
    <tr>
        <td style="padding:20px 8px 0;">
            <p style="margin:0; font-size:11px; line-height:1.6; color:#a4a192;">
                Emel ini dihantar secara automatik berkaitan tempahan anda di Tukang Perak.
                Jangan balas emel ini.
            </p>
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>