import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

// ../.. walks up out of login/, then out of pages/, landing in src/.
import { EMPTY_LOGIN, validateLogin, type LoginForm } from '../../../lib/schemas';
import { login } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext';

export default function Login() {
  const [form, setForm] = useState<LoginForm>(EMPTY_LOGIN);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const auth = useAuth();

  // One handler for every field. `field` says which key to overwrite.
  // The spread (...form) copies the other values so they survive.
  const update = (field: keyof LoginForm) => (event: CustomEvent) => {
    const value = (event.target as HTMLIonInputElement).value as string;
    setForm({ ...form, [field]: value });
  };

  async function handleSubmit() {
    const found = validateLogin(form);
    setErrors(found);

    // Object.keys({ email: '...' }) is ['email']. Length 0 means valid.
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const { token, user } = await login(form);
      auth.login(token, user);
      history.push('/home');
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Log in failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Log in</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonInput
              label="Email"
              labelPlacement="stacked"
              type="email"
              inputmode="email"
              autocomplete="email"
              value={form.email}
              onIonInput={update('email')}
              errorText={errors.email}
              className={errors.email ? 'ion-touched ion-invalid' : ''}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Password"
              labelPlacement="stacked"
              type="password"
              autocomplete="current-password"
              value={form.password}
              onIonInput={update('password')}
              errorText={errors.password}
              className={errors.password ? 'ion-touched ion-invalid' : ''}
            />
          </IonItem>
        </IonList>

        {errors.form && (
          <IonNote color="danger" className="ion-padding-start">
            {errors.form}
          </IonNote>
        )}

        <IonButton expand="block" onClick={handleSubmit} disabled={submitting}>
          Log in
        </IonButton>

        <IonNote className="ion-padding-start">
          Don't have an account?{' '}
          <a onClick={() => history.push('/signup')}>Sign up</a>
        </IonNote>
      </IonContent>
    </IonPage>
  );
}
