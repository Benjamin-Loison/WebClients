import React from 'react';
import { Icons, NotificationsProvider, ModalsProvider, ModalsChildren, CacheProvider } from 'react-components';
import ApiProvider from 'react-components/containers/api/ApiProvider';
import ConfigProvider from 'react-components/containers/config/Provider';
import createCache from 'proton-shared/lib/helpers/cache';

import * as config from '../src/app/config';
import theme from './theme';
import '../src/app/index.scss';
import './prismjs.css';
import './prismjs.js';

const cacheRef = createCache();

const tempConfig = {
    ...config,
    APP_NAME: 'proton-mail',
};

export const decorators = [
    (Story) => (
        <ConfigProvider config={tempConfig}>
            <Icons />
            <NotificationsProvider>
                <ModalsProvider>
                    <ApiProvider config={tempConfig}>
                        <ModalsChildren />
                        <CacheProvider cache={cacheRef}>
                            <Story />
                        </CacheProvider>
                    </ApiProvider>
                </ModalsProvider>
            </NotificationsProvider>
        </ConfigProvider>
    ),
];

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    docs: { theme: theme },
    options: {
        storySort: (a, b) =>
            a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
    },
};
