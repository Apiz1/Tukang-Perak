import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

/* ---------- Static option lists ---------- */
const categoryOptions = [
    { value: 'aircon',     label: 'Aircond Repair & Servicing' },
    { value: 'plumbing',   label: 'Plumbing' },
    { value: 'cleaning',   label: 'House Cleaning' },
    { value: 'electrical', label: 'Electrical' },
];

const districtOptions = [
    { value: 'parit_buntar',  label: 'Parit Buntar' },
    { value: 'kuala_kangsar', label: 'Kuala Kangsar' },
    { value: 'taiping',       label: 'Taiping' },
    { value: 'ipoh',          label: 'Ipoh' },
    { value: 'teluk_intan',   label: 'Teluk Intan' },
];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        role: 'customer',
        category: '',
        district: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Role options — keep in one place so styling stays consistent
    const roleOptions = [
        {
            value: 'customer',
            title: 'Cari perkhidmatan',
            subtitle: 'Pelanggan',
            icon: '⌕',
        },
        {
            value: 'provider',
            title: 'Tawarkan servis saya',
            subtitle: 'Tukang',
            icon: '🔧',
        },
    ];

    return (
        <GuestLayout>
            <Head title="Daftar — Tukang Perak" />

            <div className="auth-card w-full max-w-md">
                {/* ---------- Brand ---------- */}
                <Link
                    href={route('home')}
                    className="group mb-10 inline-flex items-center gap-3"
                >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm shadow-emerald-900/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                        T
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-stone-900">
                        Tukang<span className="text-emerald-700">Perak</span>
                    </span>
                </Link>

                {/* ---------- Heading ---------- */}
                <p className="eyebrow">MULA DI SINI</p>
                <h1 className="mt-4 font-serif text-4xl leading-[1.15] tracking-tight text-stone-900">
                    Cipta akaun anda.
                </h1>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                    Sertai komuniti tukang tempatan yang dipercayai di seluruh Perak.
                </p>

                {/* ---------- Form ---------- */}
                <form onSubmit={submit} className="mt-8 space-y-6">
                    {/* Name */}
                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="Nama penuh"
                            className="!text-sm !font-semibold !text-stone-700"
                        />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="auth-input mt-2 block w-full"
                            autoComplete="name"
                            isFocused
                            placeholder="Ali bin Ahmad"
                            onChange={(event) => setData('name', event.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Alamat e-mel"
                            className="!text-sm !font-semibold !text-stone-700"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="auth-input mt-2 block w-full"
                            autoComplete="username"
                            placeholder="nama@email.com"
                            onChange={(event) => setData('email', event.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <InputLabel
                            htmlFor="phone_number"
                            value="Nombor telefon"
                            className="!text-sm !font-semibold !text-stone-700"
                        />

                        <TextInput
                            id="phone_number"
                            type="tel"
                            name="phone_number"
                            value={data.phone_number}
                            className="auth-input mt-2 block w-full"
                            autoComplete="tel"
                            placeholder="012-345 6789"
                            onChange={(event) =>
                                setData('phone_number', event.target.value)
                            }
                            required
                        />

                        <InputError message={errors.phone_number} className="mt-2" />
                    </div>

                    {/* Role */}
                    <div>
                        <InputLabel
                            value="Saya ingin..."
                            className="!text-sm !font-semibold !text-stone-700"
                        />

                        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {roleOptions.map((option) => {
                                const selected = data.role === option.value;

                                return (
                                    <label
                                        key={option.value}
                                        className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
                                            selected
                                                ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                                                : 'border-stone-200 bg-stone-50 hover:border-emerald-200 hover:bg-white'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={option.value}
                                            checked={selected}
                                            onChange={(event) => {
                                                setData('role', event.target.value);
                                                // Clear provider-only fields when switching back to customer
                                                if (event.target.value === 'customer') {
                                                    setData('category', '');
                                                    setData('district', '');
                                                }
                                            }}
                                            className="sr-only"
                                        />

                                        <span
                                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base transition-colors ${
                                                selected
                                                    ? 'bg-emerald-700 text-white'
                                                    : 'bg-white text-stone-500 group-hover:text-emerald-700'
                                            }`}
                                        >
                                            {option.icon}
                                        </span>

                                        <span className="min-w-0 flex-1 pt-0.5">
                                            <span
                                                className={`block text-sm font-semibold ${
                                                    selected
                                                        ? 'text-emerald-900'
                                                        : 'text-stone-800'
                                                }`}
                                            >
                                                {option.title}
                                            </span>
                                            <span className="mt-0.5 block text-xs text-stone-500">
                                                {option.subtitle}
                                            </span>
                                        </span>

                                        {/* Check indicator */}
                                        <span
                                            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition ${
                                                selected
                                                    ? 'border-emerald-700 bg-emerald-700 text-white'
                                                    : 'border-stone-300 bg-white'
                                            }`}
                                        >
                                            {selected && (
                                                <svg
                                                    viewBox="0 0 12 12"
                                                    className="h-2.5 w-2.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                                                </svg>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    {/* ---------- Provider-only fields ---------- */}
                    {data.role === 'provider' && (
                        <div className="space-y-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
                            <div className="flex items-start gap-3">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-700 text-sm text-white">
                                    🔧
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-emerald-900">
                                        Maklumat tukang
                                    </p>
                                    <p className="mt-0.5 text-xs leading-5 text-emerald-800/80">
                                        Pilih kategori perkhidmatan dan kawasan
                                        anda beroperasi.
                                    </p>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <InputLabel
                                    htmlFor="category"
                                    value="Kategori perkhidmatan"
                                    className="!text-sm !font-semibold !text-stone-700"
                                />

                                <select
                                    id="category"
                                    name="category"
                                    value={data.category}
                                    onChange={(event) =>
                                        setData('category', event.target.value)
                                    }
                                    className="auth-input mt-2 block w-full !pr-9"
                                    required
                                >
                                    <option value="">Pilih kategori</option>
                                    {categoryOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                <InputError message={errors.category} className="mt-2" />
                            </div>

                            {/* District */}
                            <div>
                                <InputLabel
                                    htmlFor="district"
                                    value="Daerah"
                                    className="!text-sm !font-semibold !text-stone-700"
                                />

                                <select
                                    id="district"
                                    name="district"
                                    value={data.district}
                                    onChange={(event) =>
                                        setData('district', event.target.value)
                                    }
                                    className="auth-input mt-2 block w-full !pr-9"
                                    required
                                >
                                    <option value="">Pilih daerah</option>
                                    {districtOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                <InputError message={errors.district} className="mt-2" />
                            </div>
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Kata laluan"
                            className="!text-sm !font-semibold !text-stone-700"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="auth-input mt-2 block w-full"
                            autoComplete="new-password"
                            placeholder="Minimum 8 aksara"
                            onChange={(event) => setData('password', event.target.value)}
                            required
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Sahkan kata laluan"
                            className="!text-sm !font-semibold !text-stone-700"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="auth-input mt-2 block w-full"
                            autoComplete="new-password"
                            placeholder="Masukkan semula kata laluan"
                            onChange={(event) =>
                                setData('password_confirmation', event.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="primary-button group mt-2 flex w-full items-center justify-center gap-2 px-5 py-3.5 shadow-sm shadow-emerald-900/10 transition-all duration-200 hover:shadow-md hover:shadow-emerald-900/15 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                    >
                        {processing ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Sedang mendaftar...
                            </>
                        ) : (
                            <>
                                Daftar akaun
                                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                                    →
                                </span>
                            </>
                        )}
                    </button>
                </form>

                {/* ---------- Footer ---------- */}
                <div className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-600">
                    Sudah mempunyai akaun?{' '}
                    <Link
                        href={route('login')}
                        className="font-bold text-emerald-700 underline-offset-4 transition hover:text-emerald-900 hover:underline"
                    >
                        Log masuk
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}