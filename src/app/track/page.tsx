import { TrackForm } from '@/components/track-form';
import { Book, GraduationCap, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const Ornament = ({ icon, className, style }: { icon: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <div className={cn('absolute rounded-full bg-white/50 p-3 shadow-md animate-float', className)} style={style}>
    {icon}
  </div>
);

export default function TrackPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-x-hidden bg-gradient-sky">
      {/* Ornaments */}
      <Ornament icon={<GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />} className="top-[10%] left-[5%]" />
      <Ornament icon={<Book className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />} className="top-[20%] right-[10%] hidden md:block" style={{ animationDelay: '-2s' }} />
      <Ornament icon={<Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />} className="bottom-[15%] left-[15%] hidden md:block" style={{ animationDelay: '-4s' }} />
      <Ornament icon={<GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-blue-300" />} className="bottom-[10%] right-[5%]" style={{ animationDelay: '-1s' }} />


      <div className="container mx-auto px-4 py-8 md:py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <section className="flex flex-col items-center text-center z-10 w-full">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 font-headline bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">
              Lacak Keluhanmu
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Masukkan ID pelacakan unikmu untuk melihat status kirimanmu saat ini.
            </p>
          </div>
          <div className="w-full max-w-2xl">
             <TrackForm />
          </div>
        </section>
      </div>
    </div>
  );
}
