import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration';
import { getLesson } from '@rocket-house-productions/actions/server';
import { LessonContent } from '@rocket-house-productions/lesson/server';
import { Header, LessonHeader, LessonNext, LessonVideo } from '@rocket-house-productions/lesson';
import { createClient } from '@/prismicio';
import { SectionModule } from '@rocket-house-productions/types';

import { ScrollToProvider } from '@rocket-house-productions/providers';

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

  if (!data) {
    return notFound();
  }

  let page = null;
  if (data?.lesson.prismaSlug) {
    const client = createClient();
    page = await client.getByUID('lesson', data?.lesson.prismaSlug);
  }

  return (
    <ScrollToProvider>
      <Header avatar={child?.profilePicture} name={child?.name} background={data?.module?.color} />
      <LessonHeader lessonId={data.lesson.id} />
      <main className={'container mx-auto mb-20 flex max-w-5xl flex-col space-y-5 px-5'}>
        <LessonVideo lesson={data.lesson} module={data.module as SectionModule} child={child} />
        <LessonContent title={data.lesson.title} page={page} description={data.lesson.description} />
        <LessonNext lesson={data.lesson} module={data.module as SectionModule} />
      </main>
    </ScrollToProvider>
  );
}
