import { c, msgid } from 'ttag';

import { BRAND_NAME, PLANS } from '@proton/shared/lib/constants';

import { PlanCardFeature, PlanCardFeatureDefinition } from './interface';

export const getLoginsAndNotesText = () => {
    return c('new_plans: feature').t`Unlimited logins and notes`;
};

export const getLoginsAndNotes = (): PlanCardFeatureDefinition => {
    return {
        text: getLoginsAndNotesText(),
        included: true,
        icon: 'note',
    };
};

export const getDevicesText = () => {
    return c('new_plans: feature').t`Unlimited devices`;
};

export const getDevices = (): PlanCardFeatureDefinition => {
    return {
        text: getDevicesText(),
        included: true,
        icon: 'mobile',
    };
};

export const getUnlimitedHideMyEmailAliasesText = () => {
    return c('new_plans: feature').t`Unlimited Hide My Email aliases`;
};

export const getHideMyEmailAliases = (n: number | 'unlimited'): PlanCardFeatureDefinition => {
    return {
        text:
            n === 'unlimited'
                ? getUnlimitedHideMyEmailAliasesText()
                : c('new_plans: feature').ngettext(msgid`${n} Hide My Email alias`, `${n} Hide My Email aliases`, n),
        tooltip: c('new_plans: tooltip')
            .t`Unique, on-the-fly email addresses that protect your online identity and let you control what lands in your inbox. From SimpleLogin by ${BRAND_NAME}.`,
        included: true,
        icon: 'eye-slash',
    };
};

export const get2FAAuthenticatorText = () => {
    return c('new_plans: feature').t`Integrated 2FA authenticator`;
};

export const get2FAAuthenticator = (included: boolean = false): PlanCardFeatureDefinition => {
    return {
        text: get2FAAuthenticatorText(),
        included,
        icon: 'key',
    };
};

export const getVaults = (n: number): PlanCardFeatureDefinition => {
    return {
        text: c('new_plans: feature').ngettext(msgid`${n} vault`, `${n} vaults`, n),
        tooltip: c('new_plans: tooltip')
            .t`Like a folder, a vault is a convenient way to organize your items. Sharing vaults with friends and family is in the works.`,
        included: true,
        icon: 'vault',
    };
};

export const getForwardingMailboxes = (n: number | 'up to 5'): PlanCardFeatureDefinition => {
    return {
        text:
            n === 'up to 5'
                ? c('new_plans: feature').t`Up to 5 forwarding mailboxes`
                : c('new_plans: feature').ngettext(msgid`${n} forwarding mailbox`, `${n} forwarding mailboxes`, n),
        included: true,
        icon: 'envelope-arrow-up-and-right',
    };
};

export const getSharing = (included: boolean = false): PlanCardFeatureDefinition => {
    return {
        text: included
            ? c('new_plans: feature').t`Vault and Item sharing (coming soon)`
            : c('new_plans: feature').t`Vault and Item sharing`,
        included,
        icon: 'arrow-up-from-square',
        status: 'coming-soon',
    };
};

export const getDataBreachMonitoring = (included: boolean = false): PlanCardFeatureDefinition => {
    return {
        text: included
            ? c('new_plans: feature').t`Data breach monitoring (coming soon)`
            : c('new_plans: feature').t`Data breach monitoring`,
        included,
        icon: 'shield',
        status: 'coming-soon',
    };
};

export const FREE_PASS_ALIASES = 10;
export const FREE_VAULTS = 1;
export const FREE_FORWARDING_MAILBOXES = 1;

export const PASS_PLUS_VAULTS = 20;

export const getPassFeatures = (): PlanCardFeature[] => {
    return [
        {
            name: 'passwords-and-notes',
            plans: {
                [PLANS.FREE]: getLoginsAndNotes(),
                [PLANS.BUNDLE]: getLoginsAndNotes(),
                [PLANS.MAIL]: getLoginsAndNotes(),
                [PLANS.VPN]: getLoginsAndNotes(),
                [PLANS.DRIVE]: getLoginsAndNotes(),
                [PLANS.PASS_PLUS]: getLoginsAndNotes(),
                [PLANS.FAMILY]: getLoginsAndNotes(),
                [PLANS.MAIL_PRO]: getLoginsAndNotes(),
                [PLANS.BUNDLE_PRO]: getLoginsAndNotes(),
            },
        },
        {
            name: 'devices',
            plans: {
                [PLANS.FREE]: getDevices(),
                [PLANS.BUNDLE]: getDevices(),
                [PLANS.MAIL]: getDevices(),
                [PLANS.VPN]: getDevices(),
                [PLANS.DRIVE]: getDevices(),
                [PLANS.PASS_PLUS]: getDevices(),
                [PLANS.FAMILY]: getDevices(),
                [PLANS.MAIL_PRO]: getDevices(),
                [PLANS.BUNDLE_PRO]: getDevices(),
            },
        },
        {
            name: 'vaults',
            plans: {
                [PLANS.FREE]: getVaults(FREE_VAULTS),
                [PLANS.BUNDLE]: getVaults(PASS_PLUS_VAULTS),
                [PLANS.MAIL]: getVaults(FREE_VAULTS),
                [PLANS.VPN]: getVaults(FREE_VAULTS),
                [PLANS.DRIVE]: getVaults(FREE_VAULTS),
                [PLANS.PASS_PLUS]: getVaults(PASS_PLUS_VAULTS),
                [PLANS.FAMILY]: getVaults(FREE_VAULTS),
                [PLANS.MAIL_PRO]: getVaults(FREE_VAULTS),
                [PLANS.BUNDLE_PRO]: getVaults(PASS_PLUS_VAULTS),
            },
        },
        {
            name: 'hide-my-email-aliases',
            plans: {
                [PLANS.FREE]: getHideMyEmailAliases(FREE_PASS_ALIASES),
                [PLANS.BUNDLE]: getHideMyEmailAliases('unlimited'),
                [PLANS.MAIL]: getHideMyEmailAliases(FREE_PASS_ALIASES),
                [PLANS.VPN]: getHideMyEmailAliases(FREE_PASS_ALIASES),
                [PLANS.DRIVE]: getHideMyEmailAliases(FREE_PASS_ALIASES),
                [PLANS.PASS_PLUS]: getHideMyEmailAliases('unlimited'),
                [PLANS.FAMILY]: getHideMyEmailAliases(FREE_PASS_ALIASES),
                [PLANS.MAIL_PRO]: getHideMyEmailAliases(FREE_PASS_ALIASES),
                [PLANS.BUNDLE_PRO]: getHideMyEmailAliases('unlimited'),
            },
        },
        {
            name: '2fa-authenticator',
            plans: {
                [PLANS.FREE]: get2FAAuthenticator(),
                [PLANS.BUNDLE]: get2FAAuthenticator(true),
                [PLANS.MAIL]: get2FAAuthenticator(),
                [PLANS.VPN]: get2FAAuthenticator(),
                [PLANS.DRIVE]: get2FAAuthenticator(),
                [PLANS.PASS_PLUS]: get2FAAuthenticator(true),
                [PLANS.FAMILY]: get2FAAuthenticator(),
                [PLANS.MAIL_PRO]: get2FAAuthenticator(),
                [PLANS.BUNDLE_PRO]: get2FAAuthenticator(true),
            },
        },
        {
            name: 'forwarding-mailboxes',
            plans: {
                [PLANS.FREE]: getForwardingMailboxes(FREE_FORWARDING_MAILBOXES),
                [PLANS.BUNDLE]: getForwardingMailboxes('up to 5'),
                [PLANS.MAIL]: getForwardingMailboxes(FREE_FORWARDING_MAILBOXES),
                [PLANS.VPN]: getForwardingMailboxes(FREE_FORWARDING_MAILBOXES),
                [PLANS.DRIVE]: getForwardingMailboxes(FREE_FORWARDING_MAILBOXES),
                [PLANS.PASS_PLUS]: getForwardingMailboxes('up to 5'),
                [PLANS.FAMILY]: getForwardingMailboxes(FREE_FORWARDING_MAILBOXES),
                [PLANS.MAIL_PRO]: getForwardingMailboxes(FREE_FORWARDING_MAILBOXES),
                [PLANS.BUNDLE_PRO]: getForwardingMailboxes('up to 5'),
            },
        },
        {
            name: 'vault-and-item-sharing',
            plans: {
                [PLANS.FREE]: getSharing(),
                [PLANS.BUNDLE]: getSharing(true),
                [PLANS.MAIL]: getSharing(),
                [PLANS.VPN]: getSharing(),
                [PLANS.DRIVE]: getSharing(),
                [PLANS.PASS_PLUS]: getSharing(true),
                [PLANS.FAMILY]: getSharing(),
                [PLANS.MAIL_PRO]: getSharing(),
                [PLANS.BUNDLE_PRO]: getSharing(true),
            },
        },
        {
            name: 'data-breach-monitoring',
            plans: {
                [PLANS.FREE]: getDataBreachMonitoring(),
                [PLANS.BUNDLE]: getDataBreachMonitoring(true),
                [PLANS.MAIL]: getDataBreachMonitoring(),
                [PLANS.VPN]: getDataBreachMonitoring(),
                [PLANS.DRIVE]: getDataBreachMonitoring(),
                [PLANS.PASS_PLUS]: getDataBreachMonitoring(true),
                [PLANS.FAMILY]: getDataBreachMonitoring(),
                [PLANS.MAIL_PRO]: getDataBreachMonitoring(),
                [PLANS.BUNDLE_PRO]: getDataBreachMonitoring(true),
            },
        },
    ];
};
