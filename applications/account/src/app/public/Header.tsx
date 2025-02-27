import { HTMLProps, ReactNode } from 'react';

import clsx from '@proton/utils/clsx';

import BackButton from './BackButton';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
    right?: ReactNode;
    title?: ReactNode;
    subTitle?: ReactNode;
    onBack?: () => void;
    headingLevel?: number;
}

const Header = ({ className, right, title, subTitle, onBack, headingLevel, ...rest }: Props) => {
    return (
        <div className={clsx('sign-layout-header mb-6', className)} {...rest}>
            {onBack ? (
                <span className="absolute sign-layout-backbutton no-mobile">
                    <BackButton onClick={onBack} />
                </span>
            ) : null}
            {title ? (
                <div className="flex flex-align-items-center flex-justify-space-between">
                    <h1 className="sign-layout-title" aria-level={headingLevel}>
                        {title}
                    </h1>
                    {right}
                </div>
            ) : null}
            {subTitle ? <div className="mt-3 color-weak">{subTitle}</div> : null}
        </div>
    );
};

export default Header;
