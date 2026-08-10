import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  
  const getHealth = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);//import ensures env config standard across all machines
    const data = await response.json();
    setResult(JSON.stringify(data));
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>CUNY Compass</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
          <IonButton 
          onClick={getHealth}>
            Check API Health
          </IonButton>
          <div><p>{result}</p></div>

      </IonContent>
    </IonPage>
  );
};

export default Home;
