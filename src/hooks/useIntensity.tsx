import React, { useEffect, useMemo } from "react";
import { debounce } from "lodash";

function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = React.useState(null);

  const networkFn = () => {
    const handleConnectionChange = () => {
      const connection =
        navigator?.connection ||
        navigator?.mozConnection ||
        navigator?.webkitConnection;
      setNetworkInfo(connection);
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    handleConnectionChange(); // Initial check

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  };

  // Debounce de 500ms
  const debouncedHandleSearch = useMemo(
    () => debounce(networkFn, 1000),
    [networkFn]
  );

  // No olvides cancelar el debounce al desmontar el componente
  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  useEffect(() => {
    networkFn();
  }, []);
  console.log(networkInfo);
  return networkInfo;
}
export default useNetworkInfo;
