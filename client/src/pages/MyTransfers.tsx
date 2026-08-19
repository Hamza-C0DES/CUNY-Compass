import { useEffect, useState } from 'react';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { arrowForwardOutline, listOutline } from 'ionicons/icons';

import { getCourses, searchTransferRules, type Course, type TransferRule } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import './MyTransfers.css';

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

      <IonContent className="ion-padding my-transfers-content">
        {loading && (
          <div className="my-transfers-status">
            <IonSpinner name="dots" />
          </div>
        )}

        {error && (
          <IonNote color="danger" className="my-transfers-status">
            {error}
          </IonNote>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="my-transfers-empty">
            <IonIcon icon={listOutline} />
            <p>You haven't added any courses yet.</p>
          </div>
        )}

        <div className="my-transfers-list">
          {results.map(({ course, transfers }) => (
            <IonCard key={course.id} className="my-transfer-card">
              <IonCardContent>
                <div className="my-transfer-course-header">
                  <span className="my-transfer-code">{course.courseCode}</span>
                  <span className="my-transfer-name">{course.courseName}</span>
                </div>

                {transfers.length === 0 ? (
                  <p className="my-transfer-none">No transfer rule found for this course yet.</p>
                ) : (
                  <div className="my-transfer-rules">
                    {transfers.map((rule, i) => (
                      <div key={i} className="my-transfer-rule-row">
                        <IonIcon icon={arrowForwardOutline} className="my-transfer-arrow" />
                        <div className="my-transfer-rule-info">
                          <span className="my-transfer-rule-code">
                            {rule.toCourseCode ?? 'No direct match'}
                          </span>
                          <span className="my-transfer-rule-college">{rule.toCollege.name}</span>
                        </div>
                        <IonBadge color="medium">{rule.fromCredits} cr → {rule.toCredits} cr</IonBadge>
                      </div>
                    ))}
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
