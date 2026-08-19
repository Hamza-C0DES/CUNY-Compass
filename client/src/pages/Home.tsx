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
import { swapHorizontalOutline, schoolOutline, listOutline, searchOutline, addCircleOutline } from 'ionicons/icons';
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
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="ion-margin-top"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push('/my-transfers');
                    }}
                  >
                    <IonIcon icon={listOutline} slot="start" />
                    My Transfers
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="ion-margin-top"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push('/transfer');
                    }}
                  >
                    <IonIcon icon={searchOutline} slot="start" />
                    Explore Transfers
                  </IonButton>
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
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="ion-margin-top"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push('/courses/view');
                    }}
                  >
                    <IonIcon icon={listOutline} slot="start" />
                    View My Courses
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="ion-margin-top"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push('/courses/add');
                    }}
                  >
                    <IonIcon icon={addCircleOutline} slot="start" />
                    Add Course
                  </IonButton>
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
