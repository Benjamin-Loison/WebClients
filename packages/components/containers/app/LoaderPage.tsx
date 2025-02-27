import { SyntheticEvent } from 'react';

import { c } from 'ttag';

import { CircleLoader } from '@proton/atoms';
import { Button } from '@proton/atoms';
import { getAppName } from '@proton/shared/lib/apps/helper';
import { getAppFromPathnameSafe } from '@proton/shared/lib/apps/slugHelper';
import { closeDrawerFromChildApp, getIsAuthorizedApp } from '@proton/shared/lib/drawer/helpers';
import { getIsIframe } from '@proton/shared/lib/helpers/browser';
import protonSpinner from '@proton/styles/assets/img/loading-spinners/proton-spinner.svg';

import { Icon, TextLoader, Tooltip } from '../../components';
import { classnames } from '../../helpers';
import { useConfig, useDocumentTitle } from '../../hooks';

interface Props {
    documentTitle?: string;
    text?: string;
    loaderClassName?: string;
}

const LoaderPage = ({ documentTitle = '', text, loaderClassName = '' }: Props) => {
    const { APP_NAME } = useConfig();

    const isIframe = getIsIframe();
    const parentApp = getAppFromPathnameSafe(window.location.pathname);
    const isDrawerApp = isIframe && !!parentApp && getIsAuthorizedApp(parentApp);

    const appName = getAppName(APP_NAME);
    const textToDisplay = text || c('Info').t`Loading ${appName}`;

    useDocumentTitle(documentTitle || appName);

    const handleCloseIFrame = () => {
        if (!parentApp) {
            return;
        }
        closeDrawerFromChildApp(parentApp, APP_NAME);
    };

    const preventDefaultEvent = (e: SyntheticEvent) => e.preventDefault();

    return (
        <div
            className="h100"
            // Ignore drag & drop during loading to avoid issue when user drops
            // file too soon before the app is ready causing stop of the app
            // load and showing the file instead.
            onDragOver={preventDefaultEvent}
            onDragEnter={preventDefaultEvent}
            onDragEnd={preventDefaultEvent}
            onDrop={preventDefaultEvent}
        >
            <div className={classnames(['absolute-center text-center', isDrawerApp && 'w90'])}>
                {isDrawerApp && <CircleLoader className="m-auto color-primary" size="medium" />}
                {!isIframe && (
                    <div>
                        <img
                            className={classnames(['w10e', loaderClassName])}
                            src={protonSpinner}
                            aria-hidden="true"
                            alt=""
                        />
                    </div>
                )}
                <TextLoader className="color-weak">{textToDisplay}</TextLoader>
            </div>
            {isDrawerApp && (
                <div className="header pl1 flex flex-justify-end flex-align-items-center">
                    <Tooltip title={c('Action').t`Close`}>
                        <Button icon color="weak" shape="ghost" onClick={handleCloseIFrame}>
                            <Icon name="cross-big" size={16} />
                        </Button>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default LoaderPage;
