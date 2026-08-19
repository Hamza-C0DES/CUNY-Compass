import { useState } from 'react';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { arrowForwardOutline, schoolOutline, searchOutline } from 'ionicons/icons';

import { searchTransferRules, type TransferRule } from '../lib/api';
import './TransferSearch.css';

export default function TransferSearch() {
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<TransferRule[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(value: string) {
    if (!value.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const data = await searchTransferRules(value);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Transfer Lookup</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding transfer-search-content">
        <IonSearchbar
          value={search}
          placeholder="e.g. Calculus or MAT 1475"
          debounce={400}
          onIonInput={(e) => {
            const value = e.detail.value ?? '';
            setSearch(value);
            handleSearch(value);
          }}
          className="transfer-search-bar"
        />

        {error && (
          <IonNote color="danger" className="transfer-search-status">
            {error}
          </IonNote>
        )}

        {loading && (
          <div className="transfer-search-status">
            <IonSpinner name="dots" />
          </div>
        )}

        {!loading && searched && !error && results.length === 0 && (
          <div className="transfer-search-empty">
            <IonIcon icon={searchOutline} />
            <p>No matching courses found.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="transfer-search-empty">
            <IonIcon icon={schoolOutline} />
            <p>Search a course to see how it transfers between CUNY colleges.</p>
          </div>
        )}

        <div className="transfer-results">
          {results.map((rule, index) => (
            <IonCard key={index} className="transfer-rule-card">
              <IonCardContent>
                <div className="transfer-rule-row">
                  <div className="transfer-rule-course">
                    <span className="transfer-rule-code">{rule.fromCourseCode}</span>
                    <span className="transfer-rule-college">{rule.fromCollege.name}</span>
                  </div>

                  <IonIcon icon={arrowForwardOutline} className="transfer-rule-arrow" />

                  <div className="transfer-rule-course transfer-rule-course-to">
                    <span className="transfer-rule-code">
                      {rule.toCourseCode ?? 'No direct match'}
                    </span>
                    <span className="transfer-rule-college">{rule.toCollege.name}</span>
                  </div>
                </div>

                <div className="transfer-rule-footer">
                  <IonBadge color="medium">{rule.fromCredits} cr → {rule.toCredits} cr</IonBadge>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
