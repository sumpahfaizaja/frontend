'use client';

import React, { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { Paperclip } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Only .pdf, .jpg and .png formats are supported.'
    )
});

const optionalFileSchema = fileSchema.optional();

const documentSchema = z.object({
  cv: optionalFileSchema,
  transcript: optionalFileSchema,
  idCard: optionalFileSchema,
  organizationCertificate: optionalFileSchema,
  additionalDocument: optionalFileSchema
});

const formSchema = z.object({
  documents: documentSchema
});

type DocumentFormValues = z.infer<typeof formSchema>;

interface DocumentFormProps {
  initialData?: Partial<DocumentFormValues>;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const title = 'Dokumen Pendaftaran';
  const description =
    'Silahkan lengkapi formulir berikut untuk melengkapi pendaftaran Anda. Pilih file-file yang diperlukan dari komputer Anda.';
  const toastMessage = initialData
    ? 'Application updated.'
    : 'Application submitted.';
  const action = 'Simpan Dokumen';

  const defaultValues: Partial<DocumentFormValues> = {
    documents: {
      cv: undefined,
      transcript: undefined,
      idCard: undefined,
      organizationCertificate: undefined,
      additionalDocument: undefined
    }
  };

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: DocumentFormValues) => {
    try {
      setLoading(true);
      // Here you would typically send the data to your API
      // You'll need to handle file uploads, possibly using FormData
      console.log(data);
      router.push('/dashboard/');
      toast({
        title: 'Success',
        description: toastMessage
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  interface FileInputProps {
    name: keyof DocumentFormValues['documents'];
    label: string;
    required?: boolean;
    description: string;
    form: UseFormReturn<DocumentFormValues>;
  }

  const FileInput: React.FC<FileInputProps> = ({
    name,
    label,
    required = false,
    description,
    form
  }) => (
    <FormField
      control={form.control}
      name={`documents.${name}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex flex-col">
            <h3 className="mb-1 text-base text-foreground md:text-lg">
              {label}
              <span className="text-red-500">{required ? ' *' : ''}</span>
            </h3>
            <p className="mb-2 text-xs text-muted-foreground md:text-sm">
              {description}
            </p>
          </FormLabel>
          <FormControl>
            <div className="flex cursor-pointer flex-col items-center gap-y-2 rounded-lg border bg-accent p-4 text-foreground md:gap-y-4 md:py-8">
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange({ file });
                  }
                }}
                className="hidden cursor-pointer"
                id={name}
              />
              <label htmlFor={name} className="cursor-pointer">
                <Paperclip size={32} />
              </label>
              <span className="text-center text-sm text-accent-foreground">
                {field.value?.file?.name || 'Belum ada file yang dipilih'}
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator className="mb-4 mt-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5"
        >
          <FileInput
            name="cv"
            label="Curriculum Vitae"
            description="Unggah CV kamu dalam format PDF dengan ukuran maksimal 2 MB"
            form={form}
          />
          <FileInput
            name="transcript"
            label="Transkrip Nilai"
            description="Unggah Transkrip Nilai kamu dalam format PDF dengan ukuran maksimal 2 MB"
            form={form}
          />
          <FileInput
            name="idCard"
            label="KTP"
            description="Unggah foto KTP kamu dalam format PDF dengan ukuran maksimal 2MB"
            form={form}
          />
          <FileInput
            name="organizationCertificate"
            label="Sertifikat Pengalaman Organisasi"
            description="Kamu bisa tambahkan sertifikat dengan maksimal ukuran 5 MB"
            form={form}
          />
          <FileInput
            name="additionalDocument"
            label="Dokumen Tambahan"
            description="Unggah file dalam format PDF dengan ukuran maksimal 2 MB "
            form={form}
          />
          <div className="mt-2 flex w-full items-center justify-end gap-x-4">
            <Button
              disabled={loading}
              variant="secondary"
              size={'lg'}
              onClick={() => router.push('/dashboard/')}
            >
              Batal
            </Button>
            <Button disabled={loading} type="submit" size={'lg'}>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default DocumentForm;
