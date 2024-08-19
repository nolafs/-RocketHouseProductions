import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';
import { getLesson } from '@rocket-house-productions/actions/server';

import LessonContent from './_components/lesson-content';
import { Header } from '@rocket-house-productions/lesson';

export type Section = {
  id?: string;
  title?: string;
  lessons?: {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
  }[];
};

interface PageProps {
  params: { slug: string; module_slug: string; lesson_slug: string };
}

export default async function Page({ params }: PageProps) {
  if (!params.slug || !params.module_slug || !params.lesson_slug) {
    return notFound();
  }

  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const purchase = await db.purchase.findFirst({
    where: {
      course: {
        slug: params.slug,
      },
    },
  });

  if (!purchase) {
    return notFound();
  }

  if (!purchase.childId) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  const child = await db.child.findFirst({
    where: {
      id: purchase?.childId,
    },
  });

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  const data = await getLesson({
    userId,
    childId: child.id,
    courseSlug: params.slug,
    moduleSlug: params.module_slug,
    lessonSlug: params.lesson_slug,
  });

  console.log('lesson', data);

  return (
    <>
      <Header avatar={child?.profilePicture} name={child?.name} background={data?.module?.color} />
      <main className={'container mx-auto my-10 flex max-w-5xl flex-col space-y-5 px-5'}>
        <LessonContent lesson={data?.lesson} module={data?.module as Section} child={child} />
      </main>
    </>
  );
}
