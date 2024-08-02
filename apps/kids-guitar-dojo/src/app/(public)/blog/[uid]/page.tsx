import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asText } from '@prismicio/client';
import { PrismicRichText, SliceZone } from '@prismicio/react';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { HeaderSimple } from '@rocket-house-productions/layout';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID('blog_post', params.uid).catch(() => notFound());

  return {
    title: page.data?.title,
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? '' }],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client.getByUID('blog_post', params.uid).catch(() => notFound());

  return (
    <main>
      <article className={'px-5'}>
        {/* Header */}
        <HeaderSimple header={page.data.title} />
        {/* Content */}
        <div className={'prose prose-sm md:prose-md lg:prose-xl prose-neutral mx-auto mb-20'}>
          <PrismicRichText field={page.data.main} />
        </div>
      </article>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('page');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
