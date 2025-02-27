import { ReactNode } from 'react';

import { c } from 'ttag';

import { Kbd } from '@proton/atoms';
import { Icon, Tooltip, useMailSettings } from '@proton/components';
import { isSafari as checkIsSafari, metaKey, shiftKey } from '@proton/shared/lib/helpers/browser';
import clsx from '@proton/utils/clsx';

interface ButtonProps {
    onClick: () => void;
    className?: string;
    title?: ReactNode;
    children?: ReactNode;
    disabled?: boolean;
    dataTestId?: string;
}

const TitleBarButton = ({ onClick, children, className = '', title, disabled = false, dataTestId }: ButtonProps) => {
    return (
        <Tooltip title={title}>
            <button
                type="button"
                className={clsx(['composer-title-bar-button interactive-pseudo-inset relative flex p-2', className])}
                onClick={onClick}
                disabled={disabled}
                data-testid={dataTestId}
            >
                {children}
            </button>
        </Tooltip>
    );
};

interface Props {
    title: string;
    minimized: boolean;
    maximized: boolean;
    toggleMinimized: () => void;
    toggleMaximized: () => void;
    onClose: () => void;
    handleStartDragging: React.MouseEventHandler<HTMLElement>;
}

const ComposerTitleBar = ({
    title,
    minimized,
    maximized,
    toggleMinimized,
    toggleMaximized,
    handleStartDragging,
    onClose,
}: Props) => {
    const isSafari = checkIsSafari();

    const [{ Shortcuts = 0 } = {}] = useMailSettings();

    const handleDoubleClick = () => {
        if (minimized) {
            toggleMinimized();
            return;
        }
        toggleMaximized();
    };

    const titleMinimize =
        Shortcuts && !isSafari ? (
            <>
                {minimized ? c('Action').t`Maximize composer` : c('Action').t`Minimize composer`}
                <br />
                <Kbd shortcut={metaKey} /> + <Kbd shortcut="M" />
            </>
        ) : minimized ? (
            c('Action').t`Maximize composer`
        ) : (
            c('Action').t`Minimize composer`
        );

    const titleMaximize =
        Shortcuts && !isSafari ? (
            <>
                {maximized ? c('Action').t`Contract composer` : c('Action').t`Expand composer`}
                <br />
                <Kbd shortcut={metaKey} /> + <Kbd shortcut={shiftKey} /> + <Kbd shortcut="M" />
            </>
        ) : maximized ? (
            c('Action').t`Contract composer`
        ) : (
            c('Action').t`Expand composer`
        );

    const titleClose = Shortcuts ? (
        <>
            {c('Action').t`Close composer`}
            <br />
            <Kbd shortcut="Escape" />
        </>
    ) : (
        c('Action').t`Close composer`
    );

    return (
        <header
            className="composer-title-bar ui-prominent flex flex-row flex-align-items-stretch flex-nowrap pl-4 pr-1 w100"
            data-testid="composer:header"
            onDoubleClick={handleDoubleClick}
        >
            <span
                className={clsx([
                    'flex-item-fluid p-2 pr-4 text-ellipsis user-select-none',
                    (!maximized || minimized) && 'cursor-move',
                ])}
                onMouseDown={handleStartDragging}
            >
                {title}
            </span>
            <TitleBarButton
                className={clsx(['no-mobile', minimized && 'rotateX-180'])}
                title={titleMinimize}
                onClick={toggleMinimized}
                dataTestId="composer:minimize-button"
            >
                <Icon name="low-dash" alt={title} className="m-auto" />
            </TitleBarButton>
            <TitleBarButton
                title={titleMaximize}
                className="no-mobile"
                onClick={toggleMaximized}
                dataTestId="composer:maximize-button"
            >
                <Icon name={maximized ? 'arrows-to-center' : 'arrows-from-center'} alt={title} className="m-auto" />
            </TitleBarButton>
            <TitleBarButton title={titleClose} onClick={onClose} dataTestId="composer:close-button">
                <Icon name="cross" alt={title} className="m-auto" />
            </TitleBarButton>
        </header>
    );
};

export default ComposerTitleBar;
