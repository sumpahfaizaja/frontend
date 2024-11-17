interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-y-3">
      <h2 className="max-w-lg text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="max-w-lg text-sm text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
};
