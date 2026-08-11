import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import { useAuth } from '../auth/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const auth = useAuth();
  const history = useHistory();

  const getHealth = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);//import ensures env config standard across all machines
    const data = await response.json();
    setResult(JSON.stringify(data));
};

  function handleLogout() {
    auth.logout();
    history.push('/login');
  }

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
        {auth.user && <p className="ion-padding-start">Welcome, {auth.user.fullName}</p>}
        <ExploreContainer />
          <IonButton
          onClick={getHealth}>
            Check API Health
          </IonButton>
          <div><p>{result}</p></div>
          <IonButton color="medium" onClick={handleLogout}>
            Log out
          </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Home;
