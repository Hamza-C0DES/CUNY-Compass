// client/src/pages/courses/AddCourse.tsx
// CREATE — the form only. No list, no GET.

import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/react';
import { useAuth } from '../../auth/AuthContext';

const API = 'http://localhost:3000';

export default function AddCourse() {
  const { token } = useAuth();

  const [campus, setCampus] = useState('');
  const [department, setDepartment] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('');
  const [grade, setGrade] = useState('');

  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    setError('');
    setSaved('');

    // Matches the server's check exactly. Grade is the only optional field —
    // a course you're currently taking doesn't have one yet.
    if (
      !campus.trim() ||
      !department.trim() ||
      !courseCode.trim() ||
      !courseName.trim() ||
      !credits.trim()
    ) {
      setError('Everything except grade is required.');
      return;
    }

    if (!token) {
      setError('Sign in first.');
      return;
    }

    setSending(true);

    try {
      const res = await fetch(`${API}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campus: campus.trim(),
          department: department.trim(),
          courseCode: courseCode.trim(),
          courseName: courseName.trim(),
          credits: credits.trim(),
          grade: grade.trim(),
        }),
      });

      if (res.ok) {
        setSaved(`Added ${courseCode.trim().toUpperCase()}.`);
        // Clear all six, or leftover text looks like it saved twice.
        setCampus('');
        setDepartment('');
        setCourseCode('');
        setCourseName('');
        setCredits('');
        setGrade('');
      } else if (res.status === 409) {
        setError("You've already added this course.");
      } else if (res.status === 401) {
        setError('Your session expired. Sign in again.');
      } else {
        const body: { error?: string } = await res.json().catch(() => ({}));
        setError(body.error ?? `Request failed with status ${res.status}.`);
      }
    } catch {
      setError(`Couldn't reach the server. Check that it's running on ${API}.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add a course</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonInput
            label="Campus"
            labelPlacement="stacked"
            placeholder="City Tech"
            value={campus}
            onIonInput={(e) => setCampus(e.detail.value ?? '')}
          />

          <IonInput
            label="Department"
            labelPlacement="stacked"
            placeholder="Mathematics"
            value={department}
            onIonInput={(e) => setDepartment(e.detail.value ?? '')}
          />

          <IonInput
            label="Course code"
            labelPlacement="stacked"
            placeholder="MAT 1275"
            value={courseCode}
            onIonInput={(e) => setCourseCode(e.detail.value ?? '')}
          />

          <IonInput
            label="Course name"
            labelPlacement="stacked"
            placeholder="College Algebra and Trigonometry"
            value={courseName}
            onIonInput={(e) => setCourseName(e.detail.value ?? '')}
          />

          <IonInput
            label="Credits"
            labelPlacement="stacked"
            type="number"
            placeholder="4"
            value={credits}
            onIonInput={(e) => setCredits(e.detail.value ?? '')}
          />

          <IonInput
            label="Grade (optional)"
            labelPlacement="stacked"
            placeholder="A"
            value={grade}
            onIonInput={(e) => setGrade(e.detail.value ?? '')}
          />
        </IonList>

        <IonButton expand="block" onClick={handleSubmit} disabled={sending}>
          {sending ? 'Adding…' : 'Add course'}
        </IonButton>

        {/* routerLink navigates without needing useHistory. */}
        <IonButton expand="block" fill="clear" routerLink="/courses/view">
          View my courses
        </IonButton>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {saved && (
          <IonText color="success">
            <p>{saved}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
}