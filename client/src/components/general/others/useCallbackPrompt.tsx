import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useBlocker } from "./useBlocker";

export function useCallbackPrompt(when: boolean): (boolean | (() => void))[] {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [lastLocation, setLastLocation] = useState<any>(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);

    const cancelNavigation = useCallback(() => {
        setShowPrompt(false);
    }, []);

    const handleBlockedNavigation = useCallback(
        (nextLocation: any) => {
            if (
                !confirmedNavigation &&
                nextLocation.location.pathname !== location.pathname
            ) {
                setShowPrompt(true);
                setLastLocation(nextLocation);
                return false;
            }
            return true;
        },
        [confirmedNavigation]
    );

    const confirmNavigation = useCallback(() => {
        setShowPrompt(false);
        setConfirmedNavigation(true);
    }, []);

    useEffect(() => {
        if (confirmedNavigation && lastLocation) {
            navigate(lastLocation.location.pathname);
        }
    }, [confirmedNavigation, lastLocation]);

    useBlocker(handleBlockedNavigation, when);

    return [showPrompt, confirmNavigation, cancelNavigation];
}
