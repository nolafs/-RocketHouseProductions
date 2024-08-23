'use client';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import QuizScoreDisplay from './quiz-score-display';
import { Question, Questionary } from '@prisma/client';
import QuizList from './quiz-list';
import QuizNext from './quiz-next';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

export interface Quiz extends Questionary {
  questions: Question[];
}

interface QuizProps {
  course: SectionCourse;
  lesson: SectionLesson;
  module: SectionModule;
  questionaries: Quiz[];
}

export function Quiz({ course, lesson, module, questionaries }: QuizProps) {
  console.log('[Quiz] questionaries', questionaries);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timer, setTimer] = useState(true);
  const [count, setCount] = useState(1);
  const [score, setScore] = useState(0);
  const ref = useRef<any>();

  const handleQuizCompleted = () => {
    setTimer(false);
    setQuizCompleted(true);
  };

  useGSAP(
    () => {
      if (quizCompleted) {
        gsap.set('.score', { opacity: 0, scale: 0 });
        const timeline = gsap.timeline();
        timeline.to('.quiz', { opacity: 0, height: 0, duration: 0.5 });
        timeline.to('.score', { opacity: 1, scale: 1, duration: 0.5 });
      }
    },
    { scope: ref, dependencies: [quizCompleted] },
  );

  return (
    <div ref={ref}>
      <h1 className={'flex flex-col space-y-2 border-b border-t border-gray-100 py-5 text-2xl'}>
        <small className={'text-lg'} style={{ color: module.color }}>
          Lesson {lesson.position}
        </small>
        {lesson.title}
      </h1>

      <QuizScoreDisplay
        module={module}
        count={count}
        questionaries={questionaries}
        correctCount={correct}
        runTime={timer}
        onScore={score => setScore(score)}
      />

      <div className={'quiz'}>
        <QuizList
          questionaries={questionaries}
          onSlideIndexChange={index => {
            setCount(index);
          }}
          onQuizCompleted={handleQuizCompleted}
          onUpdateQuizScore={correct => {
            setCorrect(correct);
          }}
        />
      </div>
      {quizCompleted && (
        <div className={'score opacity-0'}>
          <div
            className={
              'flex w-full animate-pulse flex-col items-center justify-center rounded-lg bg-pink-500 p-5 text-lg font-bold text-white'
            }>
            <h2 className={'mb-5 text-2xl'}>
              {questionaries.length === correct && 'You a Guitar Master!!'}
              {questionaries.length !== correct && correct !== 0 && 'Well done!!'}
              {questionaries.length !== correct && correct === 0 && 'Better luck next time!!'}
            </h2>
            <div className={'font-lesson-heading text-4xl'}>{score}</div>
            <div className={'ont-lesson-heading text-sm'}>Points</div>
          </div>
        </div>
      )}

      <QuizNext module={module} lesson={lesson} course={course} quizCompleted={quizCompleted} />
    </div>
  );
}

export default Quiz;
