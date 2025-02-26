import React, { useEffect } from 'react';

type ComponentType<P = {}> = React.ComponentType<P>;

// Higher-Order Component (HOC) for logging
function withLogging<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithLogging(props: P) {
    useEffect(() => {
      console.log(`Component ${WrappedComponent.displayName || WrappedComponent.name} mounted.`);
      return () => {
        console.log(
          `Component ${WrappedComponent.displayName || WrappedComponent.name} unmounted.`
        );
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
}

export default withLogging;
