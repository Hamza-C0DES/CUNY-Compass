import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import SignUp from './pages/signup/SignUp';
import Login from './pages/login/Login';
import AddCourse from './pages/courses/AddCourse';
import ViewCourses from './pages/courses/ViewCourses';
import TransferSearch from './pages/TransferSearch';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>

          {/* SignUp Route */}
          <Route exact path="/signup">
            <SignUp />
          </Route>

          {/* Login Route */}
          <Route exact path="/login">
            <Login />
          </Route>

          {/* Home Route */}
          <PrivateRoute exact path="/home">
            <Home />
          </PrivateRoute>

          {/* Transfer Route */}
          <PrivateRoute exact path="/transfer">
            <TransferSearch />
          </PrivateRoute>

          {/* Login Route */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          {/* Old Courses Route */}
          <Route exact path="/courses">
            <Redirect to= "/courses/view" />
          </Route>

          {/* Add Courses Route */}
          <Route exact path ="/courses/add">
            <AddCourse />
          </Route>

          {/* Read Courses Route  */}
          <Route exact path="/courses/view">
            <ViewCourses />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;