import { c } from 'ttag';

import { DriveFileRevision } from '@proton/shared/lib/interfaces/drive/file';

import { ContextMenuButton } from '../../sections/ContextMenu';
import { RevisionsProviderState } from '../RevisionsProvider';

interface Props {
    revision: DriveFileRevision;
    openRevisionPreview: RevisionsProviderState['openRevisionPreview'];
    close: () => void;
}

const RevisionPreviewButton = ({ revision, openRevisionPreview, close }: Props) => {
    return (
        <ContextMenuButton
            name={c('Action').t`Preview`}
            icon="eye"
            testId="context-menu-revision-preview"
            action={() => openRevisionPreview(revision)}
            close={close}
        />
    );
};

export default RevisionPreviewButton;
