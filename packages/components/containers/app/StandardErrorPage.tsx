import { ReactNode } from 'react';

import { c } from 'ttag';

import { useDocumentTitle } from '../../hooks';
import GenericError from '../error/GenericError';

interface Props {
    children?: ReactNode;
    big?: boolean;
}

const StandardErrorPage = ({ children, big }: Props) => {
    useDocumentTitle(c('Error message').t`Oops, something went wrong`);

    return (
        <div className="h100 flex flex-align-items-center pb4 scroll-if-needed">
            <GenericError big={big}>{children}</GenericError>
        </div>
    );
};

export default StandardErrorPage;
