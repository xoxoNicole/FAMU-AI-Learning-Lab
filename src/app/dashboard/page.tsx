
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle, Clock, BookCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const modules = [
  {
    id: '1',
    title: 'AI Foundations for FAMU Faculty',
    description: 'Learn how generative AI is reshaping higher education administration.',
    image: 'https://images.unsplash.com/photo-1646583288948-24548aedffd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwc3RyYXRlZ3l8ZW58MHx8fHwxNzcyNDc2MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 100,
    time: '45 mins',
  },
  {
    id: '2',
    title: 'Drafting Strategic Content',
    description: 'Master the AI Literacy Lab tools to create high-leverage documents.',
    image: 'https://images.unsplash.com/photo-1542948330-efbf302472dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8d3JpdGluZyUyMHByb3Bvc2FsfGVufDB8fHx8MTc3MjQ3NjEwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 45,
    time: '1.5 hours',
  },
  {
    id: '3',
    title: 'Refinement & Iteration',
    description: 'Learn the "Tone Slider" and "Challenge Assumptions" techniques.',
    image: 'https://images.unsplash.com/photo-1746716809115-814c45fa1e92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxjb21tdW5pY2F0aW9uJTIwbmV0d29ya2luZ3xlbnwwfHx8fDE3NzI0NzYxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    progress: 0,
    time: '1 hour',
  }
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary">Welcome, Dean Wilson</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your strategic AI lab is ready. Let's build something powerful today.</p>
        </div>
        <div className="flex gap-3">
          <Card className="glass-card py-2 px-6 flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold">Overall Progress</p>
              <p className="text-lg font-headline font-bold text-primary">48% Complete</p>
            </div>
            <BookCheck className="w-8 h-8 text-accent" />
          </Card>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card overflow-hidden group border-none">
          <div className="relative h-64 w-full">
            <Image 
              src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDB8fHx8MTc3MjM3NTc1OHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Hero"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <span className="bg-accent px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block">Recommended Next Step</span>
              <h2 className="text-3xl font-headline font-bold mb-2">Module 2: Drafting Strategic Content</h2>
              <p className="text-white/80 max-w-xl">
                Ready to move beyond theory? Use the AI Literacy Lab to draft your next institutional memo.
              </p>
              <Link href="/modules/2">
                <Button className="mt-6 h-12 px-8 bg-white text-primary hover:bg-white/90 rounded-xl font-headline">
                  Resume Module
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="glass-card flex flex-col justify-center p-8 text-center bg-accent text-white border-none">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-headline font-bold mb-2">AI Literacy Lab</h3>
          <p className="text-white/80 mb-6">
            Jump directly into the AI interaction lab to generate or refine your content.
          </p>
          <Link href="/strategist">
            <Button variant="secondary" className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl font-headline">
              Open Lab
            </Button>
          </Link>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-headline font-bold text-primary">Learning Modules</h3>
          <Link href="/modules" className="text-accent font-bold hover:underline">View All Modules</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="glass-card hover:translate-y-[-4px] transition-all duration-300 border-none overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden">
                <Image src={module.image} alt={module.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {module.time}
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-headline">{module.title}</CardTitle>
                <CardDescription className="line-clamp-2">{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-1.5" />
                  <Link href={`/modules/${module.id}`} className="block">
                    <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-lg group-hover:bg-primary group-hover:text-white">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {module.progress === 100 ? 'Review' : module.progress > 0 ? 'Continue' : 'Start Module'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
