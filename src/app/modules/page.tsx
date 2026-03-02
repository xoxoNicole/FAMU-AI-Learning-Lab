
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, BookOpen, ChevronRight, Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const curriculum = [
  {
    id: '1',
    title: 'AI Foundations for FAMU Faculty',
    description: 'A deep dive into the ethics, limitations, and potential of generative AI within the HBCU context.',
    image: PlaceHolderImages.find(img => img.id === 'module-1')?.imageUrl || '',
    duration: '45 mins',
    level: 'Beginner',
    progress: 100,
    tags: ['Core', 'Ethics']
  },
  {
    id: '2',
    title: 'Drafting Strategic Content',
    description: 'Learn how to use the AI Lab to bypass the "blank page" problem for institutional memos and proposals.',
    image: PlaceHolderImages.find(img => img.id === 'module-2')?.imageUrl || '',
    duration: '1.5 hours',
    level: 'Intermediate',
    progress: 45,
    tags: ['Strategic', 'Writing']
  },
  {
    id: '3',
    title: 'Refinement & Iteration',
    description: 'Master the Tone Slider and the "Challenge Assumptions" tool to polish your AI-assisted outputs.',
    image: PlaceHolderImages.find(img => img.id === 'module-3')?.imageUrl || '',
    duration: '1 hour',
    level: 'Advanced',
    progress: 0,
    tags: ['Advanced', 'Mentorship']
  },
  {
    id: '4',
    title: 'Grant Writing with AI',
    description: 'Structure grant applications and donor proposals using evidence-based AI prompting.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmFudCUyMHdyaXRpbmd8ZW58MHx8fHwxNzcyNDc2MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '2 hours',
    level: 'Specialized',
    progress: 0,
    tags: ['Funding', 'Development']
  }
];

export default function ModulesListing() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-sm">
          <BookOpen className="w-4 h-4" /> 
          Strategic Curriculum
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-headline font-bold text-primary tracking-tight">Learning Modules</h1>
            <p className="text-xl text-muted-foreground mt-2">Equipping academic leaders for the next era of administration.</p>
          </div>
          <Card className="glass-card py-3 px-6 border-none flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold">Earned Badges</p>
              <p className="text-xl font-headline font-bold text-primary">3 / 12</p>
            </div>
            <Star className="w-8 h-8 text-accent fill-accent" />
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {curriculum.map((module) => (
          <Card key={module.id} className="glass-card hover:translate-y-[-6px] transition-all duration-300 border-none overflow-hidden group flex flex-col h-full">
            <div className="relative h-56 w-full overflow-hidden">
              <Image 
                src={module.image} 
                alt={module.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                {module.tags.map(tag => (
                  <span key={tag} className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Clock className="w-3 h-3" /> {module.duration}
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div className="text-xs font-bold">{module.level}</div>
              </div>
            </div>

            <CardHeader className="flex-1">
              <CardTitle className="text-2xl font-headline group-hover:text-accent transition-colors">
                {module.title}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed line-clamp-3">
                {module.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2 bg-primary/10" />
              </div>
              
              <Link href={`/modules/${module.id}`} className="block">
                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-headline font-bold transition-all">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {module.progress === 100 ? 'Review Module' : module.progress > 0 ? 'Resume Learning' : 'Start Module'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
