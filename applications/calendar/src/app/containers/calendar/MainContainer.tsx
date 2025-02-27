import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
    ErrorBoundary,
    FeatureCode,
    StandardErrorPage,
    useAddresses,
    useCalendars,
    useFeatures,
    useUser,
    useWelcomeFlags,
} from '@proton/components';
import useTelemetryScreenSize from '@proton/components/hooks/useTelemetryScreenSize';
import { useInstance } from '@proton/hooks/index';
import { getVisualCalendars, groupCalendarsByTaxonomy, sortCalendars } from '@proton/shared/lib/calendar/calendar';
import { CALENDAR_FLAGS } from '@proton/shared/lib/calendar/constants';
import { hasBit } from '@proton/shared/lib/helpers/bitset';

import Favicon from '../../components/Favicon';
import { getIsCalendarAppInDrawer } from '../../helpers/views';
import CalendarOnboardingContainer from '../setup/CalendarOnboardingContainer';
import CalendarSetupContainer from '../setup/CalendarSetupContainer';
import UnlockCalendarsContainer from '../setup/UnlockCalendarsContainer';
import MainContainerSetup from './MainContainerSetup';
import { fromUrlParams } from './getUrlHelper';

const MainContainer = () => {
    useTelemetryScreenSize();

    const [addresses] = useAddresses();
    const [calendars] = useCalendars();
    const [user] = useUser();
    const { pathname } = useLocation();

    const drawerView = useInstance(() => {
        const { view } = fromUrlParams(pathname);
        if (!getIsCalendarAppInDrawer(view)) {
            return;
        }
        document.body.classList.add('is-drawer-app');

        return view;
    });

    useFeatures([FeatureCode.CalendarSharingEnabled]);

    const memoedCalendars = useMemo(() => sortCalendars(getVisualCalendars(calendars || [])), [calendars]);
    const { ownedPersonalCalendars, holidaysCalendars } = useMemo(() => {
        return groupCalendarsByTaxonomy(memoedCalendars);
    }, [memoedCalendars]);
    const memoedAddresses = useMemo(() => addresses || [], [addresses]);

    const [{ isWelcomeFlow, isDone }, setWelcomeFlagsDone] = useWelcomeFlags();

    const [hasCalendarToGenerate, setHasCalendarToGenerate] = useState(() => {
        return ownedPersonalCalendars.length === 0;
    });
    const [hasHolidaysCalendarToGenerate, setHasHolidayCalendarToGenerate] = useState(() => {
        return isWelcomeFlow && !holidaysCalendars.length;
    });

    const [calendarsToUnlock, setCalendarsToUnlock] = useState(() => {
        return memoedCalendars.filter(({ Flags }) => {
            return hasBit(Flags, CALENDAR_FLAGS.RESET_NEEDED) || hasBit(Flags, CALENDAR_FLAGS.UPDATE_PASSPHRASE);
        });
    });

    const [calendarsToSetup, setCalendarsToSetup] = useState(() => {
        return memoedCalendars.filter(({ Flags }) => {
            return hasBit(Flags, CALENDAR_FLAGS.INCOMPLETE_SETUP);
        });
    });

    if (hasCalendarToGenerate || hasHolidaysCalendarToGenerate) {
        return (
            <CalendarSetupContainer
                hasCalendarToGenerate={hasCalendarToGenerate}
                hasHolidaysCalendarToGenerate={hasHolidaysCalendarToGenerate}
                onDone={() => {
                    setHasCalendarToGenerate(false);
                    setHasHolidayCalendarToGenerate(false);
                }}
            />
        );
    }

    if (calendarsToSetup.length) {
        return <CalendarSetupContainer calendars={calendarsToSetup} onDone={() => setCalendarsToSetup([])} />;
    }

    if (!isDone) {
        return <CalendarOnboardingContainer onDone={() => setWelcomeFlagsDone()} />;
    }

    if (calendarsToUnlock.length) {
        return (
            <UnlockCalendarsContainer
                calendars={memoedCalendars}
                calendarsToUnlock={calendarsToUnlock}
                onDone={() => {
                    setCalendarsToUnlock([]);
                }}
            />
        );
    }

    return (
        <MainContainerSetup
            user={user}
            addresses={memoedAddresses}
            calendars={memoedCalendars}
            drawerView={drawerView}
        />
    );
};

const WrappedMainContainer = () => {
    return (
        <ErrorBoundary component={<StandardErrorPage big />}>
            <Favicon />
            <MainContainer />
        </ErrorBoundary>
    );
};

export default WrappedMainContainer;
