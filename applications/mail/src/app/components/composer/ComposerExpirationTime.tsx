import { c } from 'ttag';

import { Button } from '@proton/atoms/Button';
import { Icon } from '@proton/components/components';
import clsx from '@proton/utils/clsx';

import { getExpiresOnMessage, getMessageExpirationDate } from '../../helpers/message/messageExpirationTime';
import { MessageState } from '../../logic/messages/messagesTypes';

interface Props {
    onEditExpiration: () => void;
    message: MessageState;
}

const ComposerExpirationTime = ({ message, onEditExpiration }: Props) => {
    const isExpiringDraft = !!message.draftFlags?.expiresIn;
    const expirationDate = getMessageExpirationDate(message);

    if (!expirationDate) {
        return null;
    }

    const expireOnMessage = getExpiresOnMessage(expirationDate);

    return (
        <div
            className={clsx([
                'rounded border pr-2 md:pr-1 pb-2 md:pb-1 pt-1 pl-2 flex flex-align-items-center flex-gap-0-5 mb-2',
                isExpiringDraft ? 'bg-info border-info' : 'bg-warning border-warning',
            ])}
            data-testid="expiration-banner"
        >
            <Icon name="hourglass" className="flex-item-noshrink my-auto" />
            <span className="flex-item-fluid">{expireOnMessage}</span>
            <span className="on-mobile-w100 flex-item-noshrink flex-align-items-start flex">
                <Button
                    size="small"
                    shape="outline"
                    color={isExpiringDraft ? 'info' : 'warning'}
                    fullWidth
                    className="rounded-sm"
                    onClick={onEditExpiration}
                    data-testid="message:expiration-banner-edit-button"
                >{c('Action').t`Edit`}</Button>
            </span>
        </div>
    );
};

export default ComposerExpirationTime;
