// client/src/pages/Courses.tsx

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

// Your Express server. Change the port if yours isn't 3000.
const API = 'http://localhost:3000';

export default function Courses() {
  // One piece of state per input. Three fields, three useState calls.
  // The <IonInput> shows `value`, and every keystroke calls the setter.
  const [campus, setCampus] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [credits, setCredits] = useState('');

  // Two message slots so the user always knows what happened.
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  // Disables the button while the request is in flight, so a double-tap
  // doesn't fire two POSTs and give you a surprise 409.
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    // Clear old messages first, or a stale error sits under a new success.
    setError('');
    setSaved('');

    // Check on the client because it's instant and costs no network trip.
    // The server still validates — client checks are convenience, not security.
    if (!campus.trim() || !courseCode.trim() || !credits.trim()) {
      setError('Fill in campus, course code, and credits.');
      return;
    }
    // This is the JWT your sign-in page saved after a successful login.
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Sign in first — no login token found.');
      return;
    }

    setSending(true);
    alert(3);
    try {
      const res = await fetch(`${API}/api/courses`, {
        method: 'POST',
        headers: {
          // Tells Express to run the body through express.json().
          'Content-Type': 'application/json',
          // This is what requireAuth reads to figure out req.userId.
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campus: campus.trim(),
          courseCode: courseCode.trim(),
          credits: Number(credits), // inputs are always strings; the route wants a number
        }),
      });

      // res.ok is true for any 2xx. Your create route returns 201.
      if (res.ok) {
        setSaved(`Added ${courseCode.trim()}.`);
        setCampus('');
        setCourseCode('');
        setCredits('');
      } else if (res.status === 409) {
        // The P2002 case — this user already has that campus + course code.
        setError('You already added that course.');
      } else if (res.status === 401) {
        setError('Your session expired. Sign in again.');
      } else {
        // Your route sends { error: "..." } on a 400. Showing it beats a
        // generic message, because it tells you exactly what the server rejected.
        const body: { error?: string } = await res.json().catch(() => ({}));
        setError(body.error ?? `Request failed with status ${res.status}.`);
      }
    } catch(error) {
      // fetch only throws when the request never reached the server at all:
      // server not running, wrong port, or CORS blocked it.
      console.log(error);
      setError(`Couldn't reach the server. Check that it's running on ${API}.`);
    } finally {
      // finally runs whether we succeeded or threw, so the button always unlocks.
      setSending(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add a Course</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonInput
            label="Campus"
            labelPlacement="stacked"
            placeholder="City Tech"
            value={campus}
            // onIonInput + e.detail.value is the Ionic pattern.
            // e.target.value is the one that freezes the field.
            onIonInput={(e) => setCampus(e.detail.value ?? '')}
          />

          <IonInput
            label="Course code"
            labelPlacement="stacked"
            placeholder="CST3613"
            value={courseCode}
            onIonInput={(e) => setCourseCode(e.detail.value ?? '')}
          />

          <IonInput
            label="Credits"
            labelPlacement="stacked"
            type="number"
            placeholder="3"
            value={credits}
            onIonInput={(e) => setCredits(e.detail.value ?? '')}
          />
        </IonList>

        <IonButton expand="block" onClick={handleSubmit} disabled={sending}>
          {sending ? 'Adding…' : 'Add course'}
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