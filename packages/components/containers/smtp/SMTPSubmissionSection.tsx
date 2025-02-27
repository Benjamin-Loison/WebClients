import { useEffect, useState } from 'react';

import { format, fromUnixTime } from 'date-fns';
import { c } from 'ttag';

import { Button } from '@proton/atoms/Button';
import {
    Loader,
    Prompt,
    SettingsParagraph,
    SettingsSection,
    SettingsSectionWide,
    Table,
    TableBody,
    TableHeader,
    TableRow,
    useActiveBreakpoint,
    useAddresses,
    useApi,
    useLoading,
    useModalState,
    useNotifications,
    useOrganization,
} from '@proton/components';
import { deleteToken, getTokens } from '@proton/shared/lib/api/smtptokens';
import { ADDRESS_TYPE, MAIL_APP_NAME } from '@proton/shared/lib/constants';
import { hasSMTPSubmission } from '@proton/shared/lib/helpers/organization';
import { getKnowledgeBaseUrl } from '@proton/shared/lib/helpers/url';
import { dateLocale } from '@proton/shared/lib/i18n';
import clsx from '@proton/utils/clsx';
import isTruthy from '@proton/utils/isTruthy';

import SMTPTokenModal from './SMTPTokenModal';

interface SmtpTokens {
    SmtpTokenID: string;
    AddressID: string;
    Name: string;
    CreateTime: number;
    LastUsedTime: number | null;
}

const BUSINESS_CONTACT_EMAIL = 'business-updates@proton.me';

const SMTPSubmissionSection = () => {
    const api = useApi();
    const [addresses = []] = useAddresses();
    const addressMap = new Map(addresses.map((address) => [address.ID, address.Email]));
    const hasCustomAddress = addresses.some(({ Type }) => Type === ADDRESS_TYPE.TYPE_CUSTOM_DOMAIN);
    const [organization, loadingOrganization] = useOrganization();
    const [tokenIDToRemove, setTokenIDToRemove] = useState('');
    const [loadingTokens, withLoadingTokens] = useLoading();
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const [confirmModalProps, setConfirmModalOpen, renderConfirmModal] = useModalState();
    const [generateTokenModalProps, setGenerateTokenModalOpen, renderGenerateTokenModal] = useModalState();
    const [tokens, setTokens] = useState<SmtpTokens[]>([]);
    const { isDesktop } = useActiveBreakpoint();
    const showDetails = isDesktop;
    const submissionTokenAvailable = hasSMTPSubmission(organization);
    const tokenNameToRemove = tokens.find(({ SmtpTokenID }) => SmtpTokenID === tokenIDToRemove)?.Name || '';
    const hasTokens = tokens.length > 0;

    const headers = [
        c('Header for table').t`Token name`,
        c('Header for table').t`Email address`,
        showDetails && c('Header for table').t`Created`,
        showDetails && c('Header for table').t`Last used`,
        c('Header for table').t`Actions`,
    ].filter(isTruthy);
    const headersLength = headers.length;

    const openGenerateTokenModal = () => {
        if (!hasCustomAddress) {
            createNotification({
                type: 'error',
                text: c('Error')
                    .t`You need to have a custom domain address in order to generate an SMTP submission token.`,
            });
            return;
        }
        setGenerateTokenModalOpen(true);
    };

    const confirmRemoveToken = (tokenID: string) => {
        setTokenIDToRemove(tokenID);
        setConfirmModalOpen(true);
    };

    const removeToken = async () => {
        await api(deleteToken(tokenIDToRemove));
        setTokens(tokens.filter(({ SmtpTokenID }) => SmtpTokenID !== tokenIDToRemove));
        setTokenIDToRemove('');
        setConfirmModalOpen(false);
        createNotification({ text: c('Success').t`SMTP token deleted` });
    };

    const fetchTokens = async () => {
        const { SmtpTokens } = await api(getTokens());
        setTokens(SmtpTokens);
    };

    useEffect(() => {
        if (!submissionTokenAvailable) {
            return;
        }
        void withLoadingTokens(fetchTokens());
    }, [submissionTokenAvailable]);

    if (loadingOrganization) {
        return (
            <SettingsSection>
                <Loader />
            </SettingsSection>
        );
    }

    if (!submissionTokenAvailable) {
        const emailLink = (
            <a key="email-address" href={`mailto:${BUSINESS_CONTACT_EMAIL}`}>
                {BUSINESS_CONTACT_EMAIL}
            </a>
        );
        return (
            <SettingsSection>
                <SettingsParagraph learnMoreUrl={getKnowledgeBaseUrl('/smtp-submission')}>
                    {
                        // translator: full sentence will be: SMTP allows 3rd-party services or devices to send email through <Proton Mail>. It is a new feature available to select business users. Please email <business-updates@proton.me> to request access.
                        c('Info')
                            .jt`SMTP allows 3rd-party services or devices to send email through ${MAIL_APP_NAME}. It is a new feature available to select business users. Please email ${emailLink} to request access.`
                    }
                </SettingsParagraph>
            </SettingsSection>
        );
    }

    return (
        <SettingsSectionWide>
            <SettingsParagraph learnMoreUrl={getKnowledgeBaseUrl('/smtp-submission')}>
                {c('Info')
                    .t`SMTP allows 3rd-party services or devices to send email through ${MAIL_APP_NAME}. To use this feature, start by generating a new token.`}
            </SettingsParagraph>
            <div className="mb-4">
                <Button
                    data-testid="smtp-submission:generate-token"
                    disabled={loadingTokens}
                    onClick={openGenerateTokenModal}
                >{c('Action').t`Generate token`}</Button>
            </div>
            <Table className={clsx(!loadingTokens && hasTokens && 'simple-table--has-actions')}>
                <TableHeader cells={headers} />
                <TableBody colSpan={headersLength} loading={loadingTokens}>
                    {tokens.map((token) => {
                        const email = addressMap.get(token.AddressID) || '';
                        return (
                            <TableRow
                                key={token.SmtpTokenID}
                                cells={[
                                    <span title={token.Name} className="text-ellipsis max-w100 inline-block">
                                        {token.Name}
                                    </span>,
                                    <span title={email} className="text-ellipsis max-w100 inline-block">
                                        {email}
                                    </span>,
                                    showDetails &&
                                        format(fromUnixTime(token.CreateTime), 'PPp', { locale: dateLocale }),
                                    showDetails &&
                                        (token.LastUsedTime
                                            ? format(fromUnixTime(token.LastUsedTime), 'PPp', { locale: dateLocale })
                                            : '-'),
                                    <Button
                                        size="small"
                                        disabled={loadingTokens}
                                        onClick={() => confirmRemoveToken(token.SmtpTokenID)}
                                    >{c('Action').t`Delete`}</Button>,
                                ].filter(isTruthy)}
                            />
                        );
                    })}
                    {!loadingTokens && !hasTokens && (
                        <tr>
                            <td colSpan={headersLength} className="text-center">
                                <i>{c('TableRow').t`No SMTP tokens found`}</i>
                            </td>
                        </tr>
                    )}
                </TableBody>
            </Table>
            {renderConfirmModal ? (
                <Prompt
                    title={c('Title').t`Delete ${tokenNameToRemove}?`}
                    buttons={[
                        <Button
                            color="danger"
                            data-testid="smtp-submission:confirm-deletion"
                            loading={loading}
                            onClick={() => withLoading(removeToken())}
                        >{c('Action').t`Delete`}</Button>,
                        <Button autoFocus onClick={() => setConfirmModalOpen(false)}>{c('Action').t`Cancel`}</Button>,
                    ]}
                    {...confirmModalProps}
                >
                    <p>{c('Warning')
                        .t`The device or service using this token will no longer be able to send email through ${MAIL_APP_NAME}.`}</p>
                </Prompt>
            ) : null}
            {renderGenerateTokenModal ? (
                <SMTPTokenModal
                    addresses={addresses}
                    onCreate={() => withLoadingTokens(fetchTokens())}
                    {...generateTokenModalProps}
                />
            ) : null}
        </SettingsSectionWide>
    );
};

export default SMTPSubmissionSection;
