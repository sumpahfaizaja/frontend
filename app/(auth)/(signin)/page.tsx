import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SignInForm from '@/components/forms/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Masuk ke SI-MBKM untuk mengakses fitur-fitur yang tersedia.'
};

export default function LoginPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Sign In
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-auth-pattern bg-no-repeat bg-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/60 via-transparent" />
        <div className="relative z-20 flex items-center gap-x-3 text-lg font-medium">
          <Image
            src="/logo/logo-undip.png"
            alt="Logo Undip"
            width={28}
            height={28}
            priority
          />
          SI-MBKM
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg max-w-md">
              Sistem Informasi Merdeka Belajar Kampus Merdeka Universitas
              Diponegoro
            </p>
            <footer className="text-sm">Departemen Teknik Komputer</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-y-4 sm:w-[350px]">
          <div className="flex flex-col gap-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Masuk ke SI-MBKM
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              Masukkan email dan password untuk mengakses semua fitur, hubungi
              admin bila terdapat kendala.
            </p>
          </div>
          <SignInForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Daftar Sekarang
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
