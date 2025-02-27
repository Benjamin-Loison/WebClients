import { SettingsSectionWide, classnames } from '@proton/components';

import InviteSendEmail from './InviteSendEmail';
import InviteShareLink from './InviteShareLink';
import InviteActions from './inviteActions/InviteActions';

import './InviteSection.scss';

const BorderedBox = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={classnames([className, 'border rounded p1-25'])}>{children}</div>
);

const InviteSection = () => {
    return (
        <SettingsSectionWide>
            <div className="flex flex-justify-space-between flex-gap-1 mb-8 invite-section">
                <BorderedBox className="flex-item-fluid">
                    <InviteShareLink />
                </BorderedBox>
                <BorderedBox className="flex-item-fluid">
                    <InviteSendEmail />
                </BorderedBox>
            </div>
            <InviteActions />
        </SettingsSectionWide>
    );
};

export default InviteSection;
