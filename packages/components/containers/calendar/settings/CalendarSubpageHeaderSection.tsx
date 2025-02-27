import { c } from 'ttag';

import { ButtonLike, Href } from '@proton/atoms';
import { Alert, Icon, Tooltip, useModalState } from '@proton/components/components';
import CalendarSelectIcon from '@proton/components/components/calendarSelect/CalendarSelectIcon';
import { SettingsSectionWide } from '@proton/components/containers';
import { useContactEmailsCache } from '@proton/components/containers/contacts/ContactEmailsProvider';
import { CALENDAR_STATUS_TYPE, getCalendarStatusBadges } from '@proton/shared/lib/calendar/badges';
import { getIsHolidaysCalendar } from '@proton/shared/lib/calendar/calendar';
import {
    getCalendarCreatedByText,
    getCalendarNameSubline,
} from '@proton/shared/lib/calendar/sharing/shareProton/shareProton';
import { getCalendarHasSubscriptionParameters } from '@proton/shared/lib/calendar/subscribe/helpers';
import { getKnowledgeBaseUrl } from '@proton/shared/lib/helpers/url';
import { HolidaysDirectoryCalendar, SubscribedCalendar, VisualCalendar } from '@proton/shared/lib/interfaces/calendar';
import clsx from '@proton/utils/clsx';

import { CALENDAR_MODAL_TYPE, CalendarModal } from '../calendarModal/CalendarModal';
import HolidaysCalendarModal from '../holidaysCalendarModal/HolidaysCalendarModal';
import CalendarBadge from './CalendarBadge';

interface Props {
    calendar: VisualCalendar | SubscribedCalendar;
    defaultCalendar?: VisualCalendar;
    holidaysCalendars: VisualCalendar[];
    holidaysDirectory?: HolidaysDirectoryCalendar[];
    onEdit?: () => void;
    canEdit: boolean;
}

const CalendarSubpageHeaderSection = ({
    calendar,
    defaultCalendar,
    holidaysCalendars,
    holidaysDirectory,
    onEdit,
    canEdit,
}: Props) => {
    const { contactEmailsMap } = useContactEmailsCache();

    const {
        Name,
        Description,
        Color,
        Email: memberEmail,
        Permissions: memberPermissions,
        Type: calendarType,
    } = calendar;
    const { isSubscribed, badges, isNotSyncedInfo } = getCalendarStatusBadges(calendar, defaultCalendar?.ID);
    const url = getCalendarHasSubscriptionParameters(calendar) ? calendar.SubscriptionParameters.URL : undefined;
    const createdByText = getCalendarCreatedByText(calendar, contactEmailsMap);
    const subline = getCalendarNameSubline({ calendarType, displayEmail: true, memberEmail, memberPermissions });
    const editCalendarText = c('Calendar edit button tooltip').t`Edit calendar`;

    const [calendarModal, setIsCalendarModalOpen, renderCalendarModal] = useModalState();
    const [holidaysCalendarModal, setHolidaysCalendarModalOpen, renderHolidaysCalendarModal] = useModalState();

    const handleEdit = () => {
        if (getIsHolidaysCalendar(calendar)) {
            setHolidaysCalendarModalOpen(true);
        } else {
            setIsCalendarModalOpen(true);
        }
    };

    return (
        <SettingsSectionWide className="container-section-sticky-section">
            {renderCalendarModal && (
                <CalendarModal
                    calendar={calendar}
                    type={CALENDAR_MODAL_TYPE.VISUAL}
                    onEditCalendar={onEdit}
                    {...calendarModal}
                />
            )}
            {renderHolidaysCalendarModal && holidaysDirectory && (
                <HolidaysCalendarModal
                    {...holidaysCalendarModal}
                    directory={holidaysDirectory}
                    calendar={calendar}
                    holidaysCalendars={holidaysCalendars}
                    showNotification={false}
                />
            )}
            <div className="my-6 flex flex-justify-space-between flex-nowrap">
                <div className="grid-align-icon">
                    <CalendarSelectIcon large color={Color} className="mr-3 mt-4 flex-item-noshrink keep-left" />
                    <h1 className="h1 mb-2 text-bold text-break" title={Name}>
                        {Name}
                    </h1>
                    {Description && <div className="mb-1 text-break">{Description}</div>}
                    {createdByText && (
                        <div className="text-break mb-1" title={createdByText}>
                            {createdByText}
                        </div>
                    )}
                    <div className="text-ellipsis color-weak" title={subline}>
                        {subline}
                    </div>
                    {isSubscribed && (
                        <div
                            className={clsx(['text-break text-sm mt-1 color-weak', !url && 'calendar-email'])}
                            title={url || ''}
                        >
                            {url}
                        </div>
                    )}
                    <div className="mt-1">
                        {badges
                            .filter(({ statusType }) => statusType !== CALENDAR_STATUS_TYPE.ACTIVE)
                            .map(({ statusType, badgeType, text, tooltipText }) => (
                                <CalendarBadge
                                    key={statusType}
                                    badgeType={badgeType}
                                    text={text}
                                    tooltipText={isNotSyncedInfo ? undefined : tooltipText}
                                />
                            ))}
                    </div>
                    {isNotSyncedInfo && (
                        <Alert className="my-4" type="warning">
                            {isNotSyncedInfo.longText}
                            {isNotSyncedInfo.isSyncing ? null : (
                                <div>
                                    <Href href={getKnowledgeBaseUrl('/subscribe-to-external-calendar#troubleshooting')}>
                                        {c('Link').t`Learn more`}
                                    </Href>
                                </div>
                            )}
                        </Alert>
                    )}
                </div>
                <span className="ml-4 pt-2 flex-item-noshrink">
                    <Tooltip title={editCalendarText}>
                        <ButtonLike shape="outline" onClick={handleEdit} icon disabled={!canEdit}>
                            <Icon name="pen" alt={editCalendarText} />
                        </ButtonLike>
                    </Tooltip>
                </span>
            </div>
        </SettingsSectionWide>
    );
};

export default CalendarSubpageHeaderSection;
