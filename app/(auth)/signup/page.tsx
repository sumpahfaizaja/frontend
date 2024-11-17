import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SignUpForm from '@/components/forms/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Daftarkan akun baru untuk mengakses SI-MBKM.'
};

export default function SignupPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Sign Up
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-auth-pattern bg-cover bg-no-repeat grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
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
            <p className="max-w-md text-lg">
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
              Bikin Akun Baru
            </h1>
            <p className="mb-2 text-sm text-muted-foreground">
              Masukkan email dan password untuk membuat akun baru, hubungi bila
              terdapat kendala.
            </p>
          </div>
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Masuk
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
