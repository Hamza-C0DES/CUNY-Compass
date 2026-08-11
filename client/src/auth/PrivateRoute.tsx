import type { ReactNode } from 'react';
import { Redirect, Route, type RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext';

// RouteProps.children normally also allows a render-function form; we only
// ever pass plain JSX here, so narrow it to ReactNode.
type PrivateRouteProps = Omit<RouteProps, 'children' | 'component' | 'render'> & {
  children: ReactNode;
};

// Drop-in replacement for <Route> that bounces to /login when there's no
// token instead of rendering the protected page.
export function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
  const { token } = useAuth();

  return (
    <Route
      {...rest}
      render={() => (token ? <>{children}</> : <Redirect to="/login" />)}
    />
  );
}
