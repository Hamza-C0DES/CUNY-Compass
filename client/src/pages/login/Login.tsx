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

type Form = {
  email: string;
  password: string;
};

const EMPTY: Form = { email: '', password: '' };

// Small local check-only validator. 
function validate(form: Form): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  }

  return errors;
}

export default function Login() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const history = useHistory();

  // One handler for every field. `field` says which key to overwrite.
  // The spread (...form) copies the other values so they survive.
  const update = (field: keyof Form) => (event: CustomEvent) => {
    const value = (event.target as HTMLIonInputElement).value as string;
    setForm({ ...form, [field]: value });
  };

  function handleSubmit() {
    const found = validate(form);
    setErrors(found);

    // Object.keys({ email: '...' }) is ['email']. Length 0 means valid.
    if (Object.keys(found).length > 0) return;

    // No backend yet - log it so you can prove the data is real in the demo.
    console.log('Log in submitted:', form);
    history.push('/home');
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

        <IonButton expand="block" onClick={handleSubmit}>
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
