import { DragEvent, useState } from 'react';

import { c } from 'ttag';

import { EditorMetadata, EllipsisLoader, onlyDragFiles } from '@proton/components';
import { MailSettings } from '@proton/shared/lib/interfaces';
import { Attachment } from '@proton/shared/lib/interfaces/mail/Message';
import { getAttachments } from '@proton/shared/lib/mail/messages';
import clsx from '@proton/utils/clsx';

import { PendingUpload } from '../../hooks/composer/useAttachments';
import { MessageState, MessageStateWithData, OutsideKey } from '../../logic/messages/messagesTypes';
import AttachmentList, { AttachmentAction } from '../attachment/AttachmentList';
import { MessageChange } from './Composer';
import EditorWrapper, { ExternalEditorActions } from './editor/EditorWrapper';

interface Props {
    message: MessageState;
    disabled: boolean;
    onEditorReady: (editorActions: ExternalEditorActions) => void;
    onChange: MessageChange;
    onChangeContent: (content: string) => void;
    onFocus?: () => void;
    onAddAttachments: (files: File[]) => void;
    onRemoveAttachment: (attachment: Attachment) => Promise<void>;
    onRemoveUpload?: (pendingUpload: PendingUpload) => Promise<void>;
    pendingUploads?: PendingUpload[];
    isOutside?: boolean;
    outsideKey?: OutsideKey;
    mailSettings?: MailSettings;
    editorMetadata: EditorMetadata;
}

const ComposerContent = ({
    message,
    disabled,
    onEditorReady,
    onChange,
    onChangeContent,
    onFocus,
    onAddAttachments,
    onRemoveAttachment,
    onRemoveUpload,
    pendingUploads,
    isOutside = false,
    outsideKey,
    mailSettings,
    editorMetadata,
}: Props) => {
    const [fileHover, setFileHover] = useState(false);

    const attachments = getAttachments(message.data);
    const showAttachements = attachments.length + (pendingUploads?.length || 0) > 0;

    const handleDrop = onlyDragFiles((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setFileHover(false);
        onAddAttachments?.([...event.dataTransfer.files]);
    });

    return (
        <section
            className={clsx([
                'flex-item-fluid-auto mb-2 flex flex-column flex-nowrap relative composer-content pt-2',
                attachments?.length > 0 && 'composer-content--has-attachments',
            ])}
        >
            {disabled && (
                <>
                    <div className="absolute absolute-cover placeholder opacity-50" />
                    <div className="absolute absolute-cover color-weak flex flex-justify-center flex-align-items-center">
                        {c('Info').t`Loading message`}
                        <EllipsisLoader />
                    </div>
                </>
            )}
            <div
                className={clsx([
                    'flex-item-fluid flex flex-column flex-nowrap relative',
                    isOutside && 'mx-0 sm:mx-2',
                    !isOutside && 'w100 mb-2',
                ])}
                data-testid="composer-content"
            >
                <EditorWrapper
                    message={message}
                    disabled={disabled}
                    onReady={onEditorReady}
                    onChange={onChange}
                    onChangeContent={onChangeContent}
                    onFocus={onFocus}
                    onAddAttachments={onAddAttachments}
                    onRemoveAttachment={onRemoveAttachment}
                    mailSettings={mailSettings}
                    editorMetadata={editorMetadata}
                    fileHover={fileHover}
                    setFileHover={setFileHover}
                />
            </div>
            {showAttachements && (
                <div
                    onDragOver={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onDrop={handleDrop}
                >
                    <AttachmentList
                        attachments={attachments}
                        pendingUploads={pendingUploads}
                        message={message as MessageStateWithData}
                        primaryAction={AttachmentAction.Preview}
                        secondaryAction={AttachmentAction.Remove}
                        collapsable
                        onRemoveAttachment={onRemoveAttachment}
                        onRemoveUpload={onRemoveUpload}
                        className={clsx(['composer-attachments-list', isOutside && 'eo-composer-attachments-list'])}
                        outsideKey={outsideKey}
                    />
                </div>
            )}
        </section>
    );
};

export default ComposerContent;
