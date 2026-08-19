// client/src/pages/courses/ViewCourses.tsx
// READ — the list only. No form, no POST.

import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  useIonViewWillEnter,
} from '@ionic/react';
import { addOutline, schoolOutline } from 'ionicons/icons';
import { useAuth } from '../../auth/AuthContext';
import './ViewCourses.css';

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

// Color-codes the grade badge so a scan of the list reads at a glance.
function gradeColor(grade: string | null): string {
  if (!grade) return 'medium';
  const letter = grade.trim().charAt(0).toUpperCase();
  if (letter === 'A') return 'success';
  if (letter === 'B') return 'primary';
  if (letter === 'C') return 'warning';
  return 'danger';
}

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

      <IonContent className="ion-padding view-courses-content">
        <IonButton expand="block" routerLink="/courses/add">
          <IonIcon icon={addOutline} slot="start" />
          Add a course
        </IonButton>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {/* Three states, all of which happen: loading, empty, and populated. */}
        {loading ? (
          <div className="view-courses-status">
            <IonSpinner name="dots" />
          </div>
        ) : courses.length === 0 ? (
          <div className="view-courses-empty">
            <IonIcon icon={schoolOutline} />
            <p>No courses yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="course-list">
            {courses.map((c) => (
              // key lets React tell rows apart between renders. You'll need
              // this working properly once DELETE exists.
              <IonCard key={c.id} className="course-card">
                <IonCardContent>
                  <div className="course-card-header">
                    <span className="course-code">{c.courseCode}</span>
                    {c.grade && (
                      <IonBadge color={gradeColor(c.grade)} className="course-grade-badge">
                        {c.grade}
                      </IonBadge>
                    )}
                  </div>
                  <p className="course-name">{c.courseName}</p>
                  <div className="course-card-footer">
                    <IonBadge color="light" className="course-tag">{c.campus}</IonBadge>
                    <IonBadge color="light" className="course-tag">{c.department}</IonBadge>
                    <IonBadge color="light" className="course-tag">{c.credits} credits</IonBadge>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
