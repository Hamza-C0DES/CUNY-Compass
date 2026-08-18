// client/src/pages/courses/ViewCourses.tsx
// READ — the list only. No form, no POST.

import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  useIonViewWillEnter,
} from '@ionic/react';
import { useAuth } from '../../auth/AuthContext';

const API = 'http://localhost:3000';

// Shape of one row from GET /api/courses. TypeScript-only — this doesn't
// run or validate anything. It's here so c.courseCode autocompletes and a
// typo becomes a red squiggle instead of `undefined` on the screen.
type Course = {
  id: number;
  campus: string;
  department: string;
  courseCode: string;
  courseName: string;
  credits: string;
  grade: string | null;
};

export default function ViewCourses() {
  const { token } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  // Starts true so the first paint says "Loading…" rather than flashing
  // "No courses yet" before the response lands.
  const [loading, setLoading] = useState(true);

  async function loadCourses() {
    if (!token) {
      setLoading(false);
      setError('Sign in to see your courses.');
      return;
    }

    setError('');

    try {
      const res = await fetch(`${API}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setCourses(await res.json());
      } else if (res.status === 401) {
        setError('Your session expired. Sign in again.');
      } else {
        setError(`Couldn't load courses (status ${res.status}).`);
      }
    } catch {
      setError(`Couldn't reach the server. Check that it's running on ${API}.`);
    } finally {
      setLoading(false);
    }
  }

  // Ionic keeps pages mounted after you navigate away, so a plain useEffect
  // would run once and never again — add a course, come back here, and the
  // list would be stale. useIonViewWillEnter fires every time this page
  // becomes visible, which is what you actually want for a list.
  useIonViewWillEnter(() => {
    loadCourses();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Courses</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" routerLink="/courses/add">
          Add a course
        </IonButton>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {/* Three states, all of which happen: loading, empty, and populated. */}
        {loading ? (
          <IonText color="medium">
            <p>Loading…</p>
          </IonText>
        ) : courses.length === 0 ? (
          <IonText color="medium">
            <p>No courses yet. Add your first one above.</p>
          </IonText>
        ) : (
          <IonList>
            {courses.map((c) => (
              // key lets React tell rows apart between renders. You'll need
              // this working properly once DELETE exists.
              <IonItem key={c.id}>
                <IonLabel>
                  <h2>
                    {c.courseCode} — {c.courseName}
                  </h2>
                  <p>
                    {c.campus} · {c.department} · {c.credits} credits
                    {c.grade ? ` · ${c.grade}` : ''}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}