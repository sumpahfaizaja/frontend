import Image from 'next/image';

export default function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <Image
        src="/illustration/illustration-empty.png"
        alt="Empty state"
        width={200}
        height={200}
      />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
    </div>
  );
}
