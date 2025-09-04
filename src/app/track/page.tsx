import { TrackForm } from '@/components/track-form';

export default function TrackPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="flex flex-col items-center text-center">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 font-headline">
            Track Your Complaint
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Enter your unique tracking ID to see the current status of your submission.
          </p>
          <TrackForm />
        </div>
      </section>
    </div>
  );
}
