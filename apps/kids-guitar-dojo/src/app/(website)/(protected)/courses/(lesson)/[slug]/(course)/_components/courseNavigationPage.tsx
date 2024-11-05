'use client';

import { Course } from '@prisma/client';
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CourseNavigation = dynamic(
  () => import('@rocket-house-productions/lesson').then(module => module.CourseNavigation),
  { ssr: false }, // Optional: Disable SSR if necessary
);

const CourseLeaderboard = dynamic(
  () => import('@rocket-house-productions/lesson').then(module => module.CourseLeaderboard),
  { ssr: false },
);

const CourseJukeBox = dynamic(() => import('@rocket-house-productions/lesson').then(module => module.Jukebox), {
  ssr: false,
});

const ModuleAttachments = dynamic(
  () => import('@rocket-house-productions/lesson').then(module => module.ModuleAttachments),
  {
    ssr: false,
  },
);

const CourseQuickNavigation = dynamic(
  () => import('@rocket-house-productions/lesson').then(module => module.CourseQuickNavigation),
  {
    ssr: false,
  },
);

const LessonCourseProgression = dynamic(
  () => import('@rocket-house-productions/lesson').then(module => module.LessonCourseProgression),
  {
    ssr: false,
  },
);

interface CourseNavigationPageProps {
  course: Course & { modules: any[] };
  childId?: string | null;
  purchaseType?: string | null;
  role: string;
}

export function CourseNavigationPage({ course, role, childId = null, purchaseType = null }: CourseNavigationPageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set('.footer-ui', { autoAlpha: 0, yPercent: 100 });
    },
    { scope: containerRef },
  );

  const handleLoaded = contextSafe((ready: boolean) => {
    if (ready) {
      gsap.to('.footer-ui', { duration: 1, autoAlpha: 1, yPercent: 0 });
    } else {
      gsap.to('.footer-ui', { duration: 1, autoAlpha: 0, yPercent: 100 });
    }
  });

  return (
    <div ref={containerRef}>
      <div id="course-nav" className={'relative h-screen w-full'}>
        <CourseNavigation purchaseType={purchaseType} course={course} onLoaded={loaded => handleLoaded(loaded)} />
      </div>
      <div className="footer-ui fixed bottom-0 left-0 z-50 flex w-full flex-col justify-center gap-y-5 rounded-t-lg bg-gradient-to-t from-slate-50 to-slate-200 px-3 shadow-md md:bottom-2 md:flex-row md:justify-between md:bg-transparent md:shadow-none">
        <LessonCourseProgression course={course} />
        <div className={'flex items-center justify-center gap-x-2 pb-5 md:pb-0'}>
          <CourseJukeBox course={course} />
          <CourseLeaderboard courseId={course.id} childId={childId} />
          <ModuleAttachments course={course} purchaseType={purchaseType} />
          <CourseQuickNavigation course={course} role={role} />
        </div>
      </div>
    </div>
  );
}

export default CourseNavigationPage;
