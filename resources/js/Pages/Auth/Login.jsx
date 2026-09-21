import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log masuk" />

            <div className="auth-card w-full max-w-md">
                <Link
                    href={route('home')}
                    className="group mb-10 flex items-center gap-3"
                >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-lg font-bold text-white transition-transform group-hover:-rotate-6">
                        T
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-stone-900">
                        Tukang<span className="text-emerald-700">Perak</span>
                    </span>
                </Link>

                <p className="eyebrow">SELAMAT KEMBALI</p>
                <h1 className="mt-4 font-serif text-4xl tracking-tight text-stone-900">
                    Log masuk ke akaun anda.
                </h1>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                    Urus permintaan servis dan berhubung dengan tukang tempatan.
                </p>

                {status && (
                    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-5">
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
                            isFocused
                            placeholder="nama@email.com"
                            onChange={(event) => setData('email', event.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel
                                htmlFor="password"
                                value="Kata laluan"
                                className="!text-sm !font-semibold !text-stone-700"
                            />

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                                >
                                    Lupa kata laluan?
                                </Link>
                            )}
                        </div>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="auth-input mt-2 block w-full"
                            autoComplete="current-password"
                            placeholder="Masukkan kata laluan"
                            onChange={(event) => setData('password', event.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <label className="flex cursor-pointer items-center gap-2.5 pt-1">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(event) => setData('remember', event.target.checked)}
                        />
                        <span className="text-sm text-stone-600">Ingat saya pada peranti ini</span>
                    </label>

                    <button
                        type="submit"
                        disabled={processing}
                        className="primary-button mt-2 w-full px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Sedang log masuk...' : 'Log masuk'}
                    </button>
                </form>

                <div className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-600">
                    Belum mempunyai akaun?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-emerald-700 hover:text-emerald-900"
                    >
                        Daftar sekarang
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}