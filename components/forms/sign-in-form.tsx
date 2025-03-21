'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const router = useRouter();

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        'https://backend-si-mbkm.vercel.app/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store the token in a cookie
      document.cookie = `token=${result.token}; path=/; SameSite=Strict`;

      // Decode the token to get the role
      const decoded: any = jwtDecode(result.token);
      const role = decoded.role; // Get the role from the decoded token

      // Redirect user based on their role
      if (role === 'admin_siap') {
        router.push('/dashboard-admin');
      } else if (role === 'mahasiswa') {
        router.push('/dashboard');
      } else if (role === 'koor_mbkm') {
        router.push('/dashboard-koordinator');
      } else if (role === 'dosbing') {
        router.push('/dashboard-dosbing');
      } else {
        // Fallback if the role is not recognized
        router.push('/unauthorized');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-y-4"
        >
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="w-full" type="submit">
            Masuk
          </Button>
        </form>
      </Form>
    </>
  );
}
