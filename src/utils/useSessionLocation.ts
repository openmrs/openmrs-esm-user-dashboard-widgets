import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";

const url = "/ws/rest/v1/session";

export function useSessionLocation(): UseSessionLocationResult {
  const [result, setResult] = useState<UseSessionLocationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessionLocation = async () => {
      try {
        const response = await openmrsFetch(url);
        const sessionLocationUuid = response?.data?.sessionLocation?.uuid;

        if (!sessionLocationUuid) {
          throw new Error("Session location UUID not found in the response");
        }

        setResult({
          locationUuid: sessionLocationUuid,
          error: null,
          isLoading: false
        });
      } catch (err) {
        setError(err as Error);
        setResult({
          locationUuid: "",
          error: err as Error,
          isLoading: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionLocation();
  }, []);

  return {
    locationUuid: result?.locationUuid || "",
    error: result?.error || null,
    isLoading
  };
}

export interface UseSessionLocationResult {
  locationUuid: string;
  error: Error | null;
  isLoading: boolean;
}
