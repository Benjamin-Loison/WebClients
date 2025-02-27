import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import HolidaysCalendarModal from '@proton/components/containers/calendar/holidaysCalendarModal/HolidaysCalendarModal';
import { useCalendarUserSettings, useNotifications } from '@proton/components/hooks';
import { ACCENT_COLORS_MAP } from '@proton/shared/lib/colors';
import { wait } from '@proton/shared/lib/helpers/promise';
import { localeCode, setLocales } from '@proton/shared/lib/i18n';
import { HolidaysDirectoryCalendar, VisualCalendar } from '@proton/shared/lib/interfaces/calendar';
import { generateHolidaysCalendars } from '@proton/testing/lib/builders';
import { mockNotifications } from '@proton/testing/lib/mockNotifications';

jest.mock('@proton/components/hooks/useAddresses', () => ({
    __esModule: true,
    default: jest.fn(() => []),
    useGetAddresses: jest.fn(),
}));
jest.mock('@proton/components/hooks/useGetCalendarBootstrap', () => ({
    __esModule: true,
    default: jest.fn(() => () => Promise.resolve({ CalendarSettings: { DefaultFullDayNotifications: [] } })),
    useReadCalendarBootstrap: jest.fn(),
}));
jest.mock('@proton/components/hooks/useEventManager', () => () => ({}));
jest.mock('@proton/components/containers/eventManager/calendar/ModelEventManagerProvider', () => ({
    useCalendarModelEventManager: jest.fn(() => ({})),
}));
jest.mock('@proton/components/hooks/useGetAddressKeys', () => () => ({}));
jest.mock('@proton/components/hooks/useNotifications');

jest.mock('@proton/components/hooks/useCalendarUserSettings', () => ({
    ...jest.requireActual('@proton/components/hooks/useCalendarUserSettings'),
    useCalendarUserSettings: jest.fn(),
}));

const mockedColor = '#273EB2';
jest.mock('@proton/shared/lib/colors', () => ({
    ...jest.requireActual('@proton/shared/lib/colors'),
    getRandomAccentColor: jest.fn(() => mockedColor), // return cobalt
}));

// Holidays calendars mocks

const frCalendar = {
    CalendarID: 'calendarID1',
    Country: 'France',
    CountryCode: 'fr',
    LanguageCode: 'fr',
    Language: 'Français',
    Timezones: ['Europe/Paris'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const chEnCalendar = {
    CalendarID: 'calendarID2',
    Country: 'Switzerland',
    CountryCode: 'ch',
    LanguageCode: 'en',
    Language: 'English',
    Timezones: ['Europe/Zurich'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const chDeCalendar = {
    CalendarID: 'calendarID3',
    Country: 'Switzerland',
    CountryCode: 'ch',
    LanguageCode: 'de',
    Language: 'Deutsch',
    Timezones: ['Europe/Zurich'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const beFrCalendar = {
    CalendarID: 'calendarID4',
    Country: 'Belgium',
    CountryCode: 'be',
    LanguageCode: 'fr',
    Language: 'Français',
    Timezones: ['Europe/Brussels'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const beNlCalendar = {
    CalendarID: 'calendarID5',
    Country: 'Belgium',
    CountryCode: 'be',
    LanguageCode: 'nl',
    Language: 'Dutch',
    Timezones: ['Europe/Brussels'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const nlCalendar = {
    CalendarID: 'calendarID6',
    Country: 'Netherlands',
    CountryCode: 'nl',
    LanguageCode: 'nl',
    Language: 'Dutch',
    Timezones: ['Europe/Brussels'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const esCalendar = {
    CalendarID: 'calendarID7',
    Country: 'Spain',
    CountryCode: 'es',
    LanguageCode: 'es',
    Language: 'Español',
    Timezones: ['Europe/Madrid'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const esBaCalendar = {
    CalendarID: 'calendarID8',
    Country: 'Spain',
    CountryCode: 'es',
    LanguageCode: 'eu',
    Language: 'Euskera',
    Timezones: ['Europe/Madrid'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const esCaCalendar = {
    CalendarID: 'calendarID9',
    Country: 'Spain',
    CountryCode: 'es',
    LanguageCode: 'ca',
    Language: 'Català',
    Timezones: ['Europe/Madrid'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};
const esGlCalendar = {
    CalendarID: 'calendarID10',
    Country: 'Spain',
    CountryCode: 'es',
    LanguageCode: 'gl',
    Language: 'Galego',
    Timezones: ['Europe/Madrid'],
    Passphrase: 'dummyPassphrase',
    SessionKey: {
        Key: 'dummyKey',
        Algorithm: 'dummyAlgorithm',
    },
};

const directory: HolidaysDirectoryCalendar[] = [
    frCalendar,
    chEnCalendar,
    chDeCalendar,
    beNlCalendar,
    beFrCalendar,
    nlCalendar,
    esCalendar,
    esBaCalendar,
    esCaCalendar,
    esGlCalendar,
];

const holidaysCalendars: VisualCalendar[] = generateHolidaysCalendars(2, [
    { id: frCalendar.CalendarID, name: 'Holidays in France', color: ACCENT_COLORS_MAP.cerise.color },
    { id: chEnCalendar.CalendarID, name: 'Holidays in Switzerland', color: ACCENT_COLORS_MAP.carrot.color },
]);

describe('HolidaysCalendarModal - Subscribe to a holidays calendar', () => {
    const mockedUseNotifications = mocked(useNotifications);

    beforeEach(async () => {
        mockedUseNotifications.mockImplementation(() => mockNotifications);
        setLocales({ localeCode, languageCode: 'en' });
    });

    const setup = ({
        inputCalendar,
        holidaysCalendars = [],
        showNotification,
    }: {
        inputCalendar?: VisualCalendar;
        holidaysCalendars?: VisualCalendar[];
        showNotification?: boolean;
    }) => {
        render(
            <HolidaysCalendarModal
                directory={directory}
                calendar={inputCalendar}
                holidaysCalendars={holidaysCalendars}
                showNotification={showNotification}
                open
            />
        );
    };

    describe('Add a holidays calendar', () => {
        describe('Pre-selected fields', () => {
            it('should pre-select the default holidays calendar based on time zone', () => {
                // Mock user's time zone to Paris
                // @ts-ignore
                useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Europe/Paris' }, false]);

                setup({});

                // Modal title and subtitle are displayed
                screen.getByText('Add public holidays');
                screen.getByText("Get a country's official public holidays calendar.");

                // Country is pre-selected
                screen.getByText('France');

                // Hint is displayed
                screen.getByText('Based on your time zone');

                // Language is NOT shown because there's only one available for this country
                const languageInput = screen.queryByTestId('holidays-calendar-modal:language-select');
                expect(languageInput).toBeNull();

                // Random color has been selected (we mock the result to be cobalt)
                screen.getByText('cobalt');

                // No notification set
                const notificationInput = screen.queryByTestId('notification-time-input');
                expect(notificationInput).toBeNull();

                // Add notification button is visible
                screen.getByTestId('add-notification');
            });

            it('should pre-select the default holidays calendar based on time zone and user language', () => {
                // Mock user's time zone to Zurich
                // @ts-ignore
                useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Europe/Zurich' }, false]);

                setup({});

                // Modal title and subtitle are displayed
                screen.getByText('Add public holidays');
                screen.getByText("Get a country's official public holidays calendar.");

                // Country is pre-selected
                screen.getByText('Switzerland');

                // Hint is displayed
                screen.getByText('Based on your time zone');

                // Language is shown because there's several languages for this country
                screen.getByText('English');

                // Random color has been selected (we mock the result to be cobalt)
                screen.getByText('cobalt');

                // No notification set
                const notificationInput = screen.queryByTestId('notification-time-input');
                expect(notificationInput).toBeNull();

                // Add notification button is visible
                screen.getByTestId('add-notification');
            });

            it('should pre-select the default holidays calendar based on time zone and first language', () => {
                setLocales({ localeCode, languageCode: 'something' });

                // Mock user's time zone to Spain
                // @ts-ignore
                useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Europe/Madrid' }, false]);

                setup({});

                // Modal title and subtitle are displayed
                screen.getByText('Add public holidays');
                screen.getByText("Get a country's official public holidays calendar.");

                // Country is pre-selected
                screen.getByText('Spain');

                // Hint is displayed
                screen.getByText('Based on your time zone');

                // Language is shown because there's several languages for this country
                screen.getByText('Català');

                // Random color has been selected (we mock the result to be cobalt)
                screen.getByText('cobalt');

                // No notification set
                const notificationInput = screen.queryByTestId('notification-time-input');
                expect(notificationInput).toBeNull();

                // Add notification button is visible
                screen.getByTestId('add-notification');
            });

            it('should not pre-select a default holidays calendar when no corresponding time zone is found', () => {
                // Mock user's time zone to something which does not exist in holidays calendars list we get
                // @ts-ignore
                useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Something else' }, false]);

                setup({});

                // Modal title and subtitle are displayed
                screen.getByText('Add public holidays');
                screen.getByText("Get a country's official public holidays calendar.");

                // Country is NOT pre-selected
                screen.getByText('Please select a country');

                // Hint is NOT displayed
                const hint = screen.queryByText('Based on your time zone');
                expect(hint).toBeNull();

                // Language is NOT shown because no default country is found
                const languageInput = screen.queryByTestId('holidays-calendar-modal:language-select');
                expect(languageInput).toBeNull();

                // Random color has been selected (we mock the result to be cobalt)
                screen.getByText('cobalt');

                // No notification set
                const notificationInput = screen.queryByTestId('notification-time-input');
                expect(notificationInput).toBeNull();

                // Add notification button is visible
                screen.getByTestId('add-notification');
            });
        });

        describe('Already added holidays calendar', () => {
            it('should not pre-select the default calendar if the user already added it', () => {
                // Mock user's time zone to Paris
                // @ts-ignore
                useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Europe/Paris' }, false]);

                setup({ holidaysCalendars });

                // Modal title and subtitle are displayed
                screen.getByText('Add public holidays');
                screen.getByText("Get a country's official public holidays calendar.");

                // Country is NOT pre-selected
                screen.getByText('Please select a country');

                // Hint is NOT displayed
                const hint = screen.queryByText('Based on your time zone');
                expect(hint).toBeNull();

                // Language is NOT shown because there's only one available for this country
                const languageInput = screen.queryByTestId('holidays-calendar-modal:language-select');
                expect(languageInput).toBeNull();

                // Random color has been selected (we mock the result to be cobalt)
                screen.getByText('cobalt');

                // No notification set
                const notificationInput = screen.queryByTestId('notification-time-input');
                expect(notificationInput).toBeNull();

                // Add notification button is visible
                screen.getByTestId('add-notification');
            });

            it('should display an error message when selecting a country of an already added holidays calendar', () => {
                // Mock user's time zone to Paris
                // @ts-ignore
                useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Europe/Paris' }, false]);

                setup({ holidaysCalendars });

                // Modal title and subtitle are displayed
                screen.getByText('Add public holidays');
                screen.getByText("Get a country's official public holidays calendar.");

                // Country is NOT pre-selected
                const countryInput = screen.getByText('Please select a country');

                // Open dropdown
                fireEvent.click(countryInput);

                // Select France
                const franceDropdownOption = screen.getByText('France');
                fireEvent.click(franceDropdownOption);

                // Click "Add"
                const submitButton = screen.getByText('Add');
                fireEvent.click(submitButton);

                // An error is displayed under the country input
                screen.getByText('You already added this holidays calendar');
            });
        });
    });

    describe('Edit a holidays calendar', () => {
        it('should pre-select all fields in modal', async () => {
            // Mock user's time zone to Paris
            // @ts-ignore
            useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Europe/Paris' }, false]);

            setup({
                holidaysCalendars,
                inputCalendar: holidaysCalendars[0],
                showNotification: false,
            });

            // "Fake" wait because modal is on a loading state by default
            await wait(0);

            // Modal title is displayed
            screen.getByText('Edit calendar');
            // No modal subtitle is displayed
            const subtitle = screen.queryByText("Get a country's official public holidays calendar.");
            expect(subtitle).toBeNull();

            // Country is pre-selected
            screen.getByText('France');

            // Hint is displayed
            screen.getByText('Based on your time zone');

            // Language is NOT shown because there's only one available for this country
            const languageInput = screen.queryByTestId('holidays-calendar-modal:language-select');
            expect(languageInput).toBeNull();

            // Random color has been selected (we mock the result to be cobalt)
            screen.getByText('cerise');

            // Add notification button is NOT visible in edit mode
            const notificationButton = screen.queryByTestId('add-notification');
            expect(notificationButton).toBeNull();
        });

        it('should display a message when user wants to change country to an already subscribed calendar', async () => {
            // Mock user's time zone to Zurich
            // @ts-ignore
            useCalendarUserSettings.mockReturnValue([{ PrimaryTimezone: 'Europe/Zurich' }, false]);

            setup({
                holidaysCalendars,
                inputCalendar: holidaysCalendars[1],
                showNotification: false,
            });

            // "Fake" wait because modal is on a loading state by default
            await wait(0);

            // Modal title is displayed
            screen.getByText('Edit calendar');
            // No modal subtitle is displayed
            const subtitle = screen.queryByText("Get a country's official public holidays calendar.");
            expect(subtitle).toBeNull();

            // Country is pre-selected
            const countryInput = screen.getByText('Switzerland');

            // Random color has been selected (we mock the result to be cobalt)
            screen.getByText('carrot');

            // Add notification button is NOT visible in edit mode
            const notificationButton = screen.queryByTestId('add-notification');
            expect(notificationButton).toBeNull();

            // Open dropdown
            fireEvent.click(countryInput);

            // Select France
            const frDropdownOption = screen.getByText('France');
            fireEvent.click(frDropdownOption);

            // An error is displayed under the country input after trying to save
            const submitButton = screen.getByText('Save');
            fireEvent.click(submitButton);

            screen.getByText('You already added this holidays calendar');
        });
    });
});
