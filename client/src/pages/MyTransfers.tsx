import { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { getCourses, searchTransferRules, type Course, type TransferRule } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

type CourseWithTransfers = {
  course: Course;
  transfers: TransferRule[];
};

export default function MyTransfers() {
  const { token } = useAuth();
  const [results, setResults] = useState<CourseWithTransfers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransfers() {
      try {
        const courses = await getCourses(token!);

        const combined = await Promise.all(
          courses.map(async (course) => {
            const matches = await searchTransferRules(course.courseCode);
            const exact = matches.filter(
              (rule) => rule.fromCourseCode.toUpperCase() === course.courseCode.toUpperCase()
            );

            return { course, transfers: exact };
          })
        );

        setResults(combined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load transfers');
      } finally {
        setLoading(false);
      }
    }
    loadTransfers();
  }, [token]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Course Transfers</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonSpinner />}
        {error && <IonNote color="danger">{error}</IonNote>}

        {!loading && !error && results.length === 0 && (
          <IonNote>You haven't added any courses yet.</IonNote>
        )}

        <IonList inset>
          {results.map(({ course, transfers }) => (
            <IonItem key={course.id}>
              <IonNote>
                <strong>
                  {course.courseCode} — {course.courseName}
                </strong>
                <br />
                {transfers.length === 0 && 'No transfer rule found for this course yet.'}
                {transfers.map((rule, i) => (
                  <div key={i}>
                    → {rule.toCourseCode ?? 'No direct match'} ({rule.toCollege.name})
                    <br />
                    Credits: {rule.fromCredits} → {rule.toCredits}
                  </div>
                ))}
              </IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}