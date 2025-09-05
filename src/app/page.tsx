import { ComplaintForm } from '@/components/complaint-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Book, GraduationCap, Lightbulb } from 'lucide-react';

const Ornament = ({ icon, className }: { icon: React.ReactNode, className: string }) => (
  <div className={`absolute rounded-full bg-white/50 p-3 shadow-md animate-float ${className}`}>
    {icon}
  </div>
);

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-sky">
      <div className="container mx-auto px-4 py-8 md:py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        
        {/* Ornaments */}
        <Ornament icon={<GraduationCap className="h-8 w-8 text-blue-400" />} className="top-[10%] left-[5%] animate-float" />
        <Ornament icon={<Book className="h-10 w-10 text-blue-500" />} className="top-[20%] right-[10%]" style={{ animationDelay: '-2s' }} />
        <Ornament icon={<Lightbulb className="h-6 w-6 text-yellow-400" />} className="bottom-[15%] left-[15%]" style={{ animationDelay: '-4s' }} />
        <Ornament icon={<GraduationCap className="h-8 w-8 text-blue-300" />} className="bottom-[10%] right-[5%]" style={{ animationDelay: '-1s' }} />


        <section className="flex flex-col items-center text-center z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">
              Aspirasi Siswa SMKN 2 Luwu Timur
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Platform anonim untuk kamu menyuarakan keprihatinan dan berkontribusi untuk lingkungan SMKN 2 Luwu Timur yang lebih baik.
            </p>
          </div>
          <Card className="w-full max-w-2xl shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Kirim Keluhan</CardTitle>
              <CardDescription>Semua kiriman sepenuhnya anonim. Harap jelaskan keluhanmu dengan jelas.</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintForm />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
