import { ComplaintForm } from '@/components/complaint-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Aspirasi Siswa
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Your anonymous platform to voice concerns and contribute to a better school environment.
          </p>
        </div>
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Submit a Complaint</CardTitle>
            <CardDescription>All submissions are completely anonymous. Please describe your concern clearly.</CardDescription>
          </CardHeader>
          <CardContent>
            <ComplaintForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
