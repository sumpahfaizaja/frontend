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

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z.string().nonempty({ message: 'Name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  NIM: z.string().nonempty({ message: 'NIM is required' }), // New field for NIM
  semester: z.coerce.number().min(1, { message: 'Semester must be at least 1' }) // Coerce to number
});

type UserFormValue = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState('/login');
  const router = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      // Format the data for submission
      const formattedData = {
        ...data,
        role: 'mahasiswa' // Default role
      };

      const response = await fetch(
        'https://backend-si-mbkm.vercel.app/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        }
      );

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="NIM"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIM</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your NIM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your semester"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} className="w-full" type="submit">
          Register
        </Button>
      </form>
        
    </Form>
  );
}
