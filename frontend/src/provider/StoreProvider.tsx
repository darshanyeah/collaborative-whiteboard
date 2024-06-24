"use client";
import { persistor, store } from "@/lib/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

/**
 * A React component that provides the Redux store to its descendants using the
 * React Redux Provider component. It also uses the Redux Persist library to
 * persist the store's state to local storage.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped
 *                                          by the store provider.
 * @return {JSX.Element} The wrapped child components with the Redux store
 *                       provider and persistor.
 */
const StoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
