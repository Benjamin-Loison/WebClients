import { ReactNode, useState } from 'react';

import { c } from 'ttag';

import { Avatar } from '@proton/atoms/Avatar';
import { Button } from '@proton/atoms/Button';
import {
    Copy,
    InputFieldTwo,
    ModalProps,
    ModalTwo,
    ModalTwoContent,
    ModalTwoFooter,
    ModalTwoHeader,
    PasswordInputTwo,
    useFormErrors,
    useModalState,
} from '@proton/components/components';
import { useLoading, useNotifications } from '@proton/components/hooks';
import { BRAND_NAME } from '@proton/shared/lib/constants';
import {
    confirmPasswordValidator,
    getMinPasswordLengthMessage,
    passwordLengthValidator,
} from '@proton/shared/lib/helpers/formValidators';
import { getInitials } from '@proton/shared/lib/helpers/string';
import noop from '@proton/utils/noop';

import Content from '../public/Content';
import Header from '../public/Header';
import Main from '../public/Main';
import Layout from './Layout';
import { OnUpdate } from './interface';

const CopyPasswordModal = ({
    password,
    onConfirm,
    onEdit,
    children,
    ...rest
}: ModalProps & {
    password: string;
    onEdit: () => void;
    onConfirm: () => void;
    children: ReactNode;
}) => {
    return (
        <ModalTwo size="small" {...rest}>
            <ModalTwoHeader title={c('Info').t`Your ${BRAND_NAME} password`} />
            <ModalTwoContent>
                {children}
                <div>{c('Info').t`Be sure to copy your password and store it somewhere safe.`}</div>
            </ModalTwoContent>
            <ModalTwoFooter>
                <Button
                    onClick={() => {
                        onEdit();
                        rest?.onClose?.();
                    }}
                >{c('Action').t`Edit password`}</Button>
                <Button color="norm" onClick={onConfirm}>{c('Action').t`Confirm`}</Button>
            </ModalTwoFooter>
        </ModalTwo>
    );
};

const Step3 = ({
    onComplete,
    password,
    email,
    onUpdate,
}: {
    password: string;
    email: string;
    onComplete: (newPassword: string | undefined) => Promise<void>;
    onUpdate: OnUpdate;
}) => {
    const { createNotification } = useNotifications();
    const [setOwnPasswordMode, setSetOwnPasswordMode] = useState(false);
    const [copyModalProps, setCopyModal, renderCopyModal] = useModalState();

    const [loading, withLoading] = useLoading();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [copied, setCopied] = useState(false);

    const { validator, onFormSubmit, reset } = useFormErrors();

    const content = (
        <div className="pl-4 py-1 mb-4 bg-weak rounded flex flex-justify-space-between flex-align-items-center">
            <div
                className="user-select text-pre-wrap break"
                onCopy={() => {
                    setCopied(true);
                }}
            >
                {password}
            </div>
            <Copy
                tooltipText={c('Info').t`Copy the suggested password to clipboard`}
                shape="ghost"
                value={password}
                onCopy={() => {
                    onUpdate({ pw: 'copied' });
                    setCopied(true);
                    createNotification({ text: c('Info').t`Password copied to clipboard` });
                }}
            />
        </div>
    );

    const finalPassword = setOwnPasswordMode ? newPassword : undefined;
    const onBack = setOwnPasswordMode
        ? () => {
              if (loading) {
                  return;
              }
              setSetOwnPasswordMode(false);
          }
        : undefined;

    return (
        <Layout hasDecoration={false} onBack={onBack}>
            <Main>
                <Header title={c('Title').t`Set your password`} onBack={onBack} />
                <Content>
                    <div className="flex gap-2 mb-6">
                        <Avatar color="weak">{getInitials(email)}</Avatar>
                        <div className="flex text-ellipsis flex-align-items-center flex-justify-center">{email}</div>
                    </div>
                    <form
                        name="setPasswordForm"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (loading || !onFormSubmit()) {
                                return;
                            }

                            if (!setOwnPasswordMode) {
                                onUpdate({ pw: 'continue' });
                            } else {
                                onUpdate({ pw: 'setcustom' });
                            }

                            if (!copied && !setOwnPasswordMode) {
                                setCopyModal(true);
                            } else {
                                withLoading(onComplete(finalPassword)).catch(noop);
                            }
                        }}
                        method="post"
                    >
                        {!setOwnPasswordMode ? (
                            <>{content}</>
                        ) : (
                            <>
                                <InputFieldTwo
                                    as={PasswordInputTwo}
                                    id="password"
                                    bigger
                                    label={c('Label').t`Password`}
                                    assistiveText={getMinPasswordLengthMessage()}
                                    error={validator([passwordLengthValidator(newPassword)])}
                                    disableChange={loading}
                                    autoFocus
                                    value={newPassword}
                                    onValue={setNewPassword}
                                />
                                <InputFieldTwo
                                    as={PasswordInputTwo}
                                    id="password-repeat"
                                    bigger
                                    label={c('Label').t`Confirm password`}
                                    error={validator([
                                        passwordLengthValidator(confirmNewPassword),
                                        confirmPasswordValidator(confirmNewPassword, newPassword),
                                    ])}
                                    disableChange={loading}
                                    value={confirmNewPassword}
                                    onValue={setConfirmNewPassword}
                                    rootClassName="mt-2"
                                />
                            </>
                        )}
                        <Button size="large" color="norm" type="submit" fullWidth loading={loading} className="mt-5">
                            {setOwnPasswordMode
                                ? c('Action').t`Set new password`
                                : c('Action').t`Continue with this password`}
                        </Button>
                        {!setOwnPasswordMode && (
                            <Button
                                size="large"
                                color="norm"
                                shape="ghost"
                                type="submit"
                                fullWidth
                                loading={loading}
                                className="mt-2"
                                onClick={() => {
                                    onUpdate({ pw: 'custom' });
                                    setSetOwnPasswordMode(true);
                                    reset();
                                }}
                            >
                                {c('Action').t`Choose my own password`}
                            </Button>
                        )}
                    </form>
                </Content>
            </Main>
            {renderCopyModal && (
                <CopyPasswordModal
                    {...copyModalProps}
                    children={content}
                    onEdit={() => {
                        setSetOwnPasswordMode(true);
                        reset();
                    }}
                    onConfirm={() => onComplete(finalPassword).catch(noop)}
                    password={password}
                />
            )}
        </Layout>
    );
};

export default Step3;
