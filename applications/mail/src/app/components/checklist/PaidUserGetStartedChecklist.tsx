import { useEffect } from 'react';

import { c } from 'ttag';

import { ChecklistItem, Loader, useApi } from '@proton/components';
import { seenCompletedChecklist } from '@proton/shared/lib/api/checklist';
import { ChecklistKey } from '@proton/shared/lib/interfaces';
import isTruthy from '@proton/utils/isTruthy';

import { usePaidUserChecklist } from '../../containers/checklists';
import GetStartedChecklistHeader from './GetStartedChecklistHeader';

import './GetStartedChecklist.scss';

interface Props {
    onItemSelection: (key: ChecklistKey) => () => void;
    onDismiss?: () => void;
}

const PaidUserGetStartedChecklist = ({ onDismiss, onItemSelection }: Props) => {
    const api = useApi();
    const { checklist, loading } = usePaidUserChecklist();

    const checklistItems = (
        [
            {
                key: ChecklistKey.Import,
                text: c('Paid user checklist item').t`Import contacts or emails`,
                icon: 'arrow-down-to-square',
            },
            {
                key: ChecklistKey.SendMessage,
                text: c('Paid user checklist item').t`Send a message`,
                icon: 'paper-plane',
            },
            {
                key: ChecklistKey.RecoveryMethod,
                text: c('Paid user checklist item').t`Set up a recovery method`,
                icon: 'lock',
            },
            {
                key: ChecklistKey.MobileApp,
                text: c('Paid user checklist item').t`Get mobile app`,
                icon: 'mobile',
            },
        ] as const
    )
        .filter(isTruthy)
        .map(({ key, ...rest }) => ({
            key,
            complete: checklist.includes(key),
            onClick: onItemSelection(key),
            ...rest,
        }));

    const hasCompletedAllItems = checklistItems.every(({ complete }) => complete);
    useEffect(() => {
        if (hasCompletedAllItems) {
            void api({ ...seenCompletedChecklist('paying-user'), silence: true });
        }
    }, [hasCompletedAllItems]);

    const numberOfCompletedItems = checklist.length;

    if (loading) {
        return (
            <div className="p1 m-auto">
                <Loader />
            </div>
        );
    }

    const { length: totalNumberOfItems } = checklistItems;

    return (
        <div className="p1">
            <GetStartedChecklistHeader
                totalNumberOfItems={totalNumberOfItems}
                numberOfCompletedItems={numberOfCompletedItems}
                onDismiss={onDismiss}
            />

            <ul className="unstyled ml-2">
                {checklistItems
                    .sort(({ complete: completeA }, { complete: completeB }) => Number(completeA) - Number(completeB))
                    .map(({ key, text, icon, onClick }) => (
                        <ChecklistItem
                            key={key}
                            text={text}
                            icon={icon}
                            complete={checklist.includes(key)}
                            onClick={onClick}
                        />
                    ))}
            </ul>
            <hr />
        </div>
    );
};

export default PaidUserGetStartedChecklist;
