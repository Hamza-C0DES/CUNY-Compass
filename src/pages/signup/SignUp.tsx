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

// ../.. walks up out of signup/, then out of pages/, landing in src/.
import { EMPTY, validate, type Form } from '../../lib/schemas';

export default function SignUp() {
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
    console.log('Sign up submitted:', form);
    history.push('/home');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create your account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonInput
              label="Full name"
              labelPlacement="stacked"
              autocomplete="name"
              value={form.fullName}
              onIonInput={update('fullName')}
              errorText={errors.fullName}
              className={errors.fullName ? 'ion-touched ion-invalid' : ''}
            />
          </IonItem>

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
              autocomplete="new-password"
              value={form.password}
              onIonInput={update('password')}
              errorText={errors.password}
              className={errors.password ? 'ion-touched ion-invalid' : ''}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Confirm password"
              labelPlacement="stacked"
              type="password"
              autocomplete="new-password"
              value={form.confirmPassword}
              onIonInput={update('confirmPassword')}
              errorText={errors.confirmPassword}
              className={errors.confirmPassword ? 'ion-touched ion-invalid' : ''}
            />
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={handleSubmit}>
          Create account
        </IonButton>

        <IonNote className="ion-padding-start">
          Already have an account?{' '}
          <a onClick={() => history.push('/login')}>Log in</a>
        </IonNote>
      </IonContent>
    </IonPage>
  );
}