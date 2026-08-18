import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from '@ionic/react';
import { swapHorizontalOutline, schoolOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const auth = useAuth();
  const history = useHistory();

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
      <IonContent fullscreen className="ion-padding">
        {auth.user && <p>Welcome, {auth.user.fullName}</p>}

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/transfer')}>
                <IonCardHeader>
                  <IonIcon icon={swapHorizontalOutline} size="large" color="primary" />
                  <IonCardTitle>Transfer</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  Search how a course transfers between CUNY colleges.
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/courses')}>
                <IonCardHeader>
                  <IonIcon icon={schoolOutline} size="large" color="primary" />
                  <IonCardTitle>Courses</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  View and add the courses you've taken.
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton color="medium" onClick={handleLogout}>
          Log out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
