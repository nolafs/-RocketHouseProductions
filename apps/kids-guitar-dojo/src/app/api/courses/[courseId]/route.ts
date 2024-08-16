import { NextResponse } from 'next/server';
import { db } from '@rocket-house-productions/integration';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        /*
        modules: {
          include: {
            muxData: true,
          },
        },

         */
      },
    });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    /*
    for (const chapter of course.modules) {
      if (chapter.muxData?.assetId) {
        // await Video.Assets.del(chapter.muxData.assetId);
      }
    }

     */

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    console.log('PATCH', params);
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSE_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
