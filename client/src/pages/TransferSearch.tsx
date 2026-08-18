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

import { searchTransferRules, type TransferRule } from '../lib/api';

export default function TransferSearch() {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<TransferRule[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSearch() {
    try {
      const data = await searchTransferRules(search);
      setResults(data);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Search failed' });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Transfer Lookup</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonInput
              label="Search"
              labelPlacement="stacked"
              placeholder="e.g. Calculus or MAT 1475"
              value={search}
              onIonInput={(e) => setSearch(e.detail.value ?? "")}
            />
          </IonItem>
        </IonList>

        {errors.form && (
          <IonNote color="danger" className="ion-padding-start">
            {errors.form}
          </IonNote>
        )}

        <IonButton expand="block" onClick={handleSearch}>
          Search
        </IonButton>

        <IonList inset>
          {results.map((rule, index) => (
            <IonItem key={index}>
              <IonNote>
                {rule.fromCourseCode} ({rule.fromCollege.name}) → {rule.toCourseCode ?? "No direct match"} ({rule.toCollege.name})
                <br />
                Credits: {rule.fromCredits} → {rule.toCredits}
              </IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}