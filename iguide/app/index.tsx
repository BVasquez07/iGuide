import { useRouter, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import React from "react";

export default function Index(): JSX.Element | null {
    const router = useRouter();
    const navigationRef = useNavigationContainerRef();

    useEffect(() => {
        const unsubscribe = navigationRef?.addListener("state", () => {
            router.replace("/HomeScreen"); // Redirect safely after mounting
        });

        return () => unsubscribe?.();
    }, [navigationRef]);

    return null; // No UI needed, it's just for redirection
}
