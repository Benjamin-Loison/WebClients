import { Ref, Suspense, lazy } from 'react';

import { c } from 'ttag';

import { Vr } from '@proton/atoms';
import { ErrorBoundary } from '@proton/components/containers';
import { MailSettings } from '@proton/shared/lib/interfaces';

import { classnames } from '../../../helpers';
import { useActiveBreakpoint } from '../../../hooks';
import { ButtonGroup } from '../../button';
import Icon from '../../icon/Icon';
import { DEFAULT_FONT_SIZE } from '../constants';
import { ToolbarConfig } from '../helpers/getToolbarConfig';
import { EditorMetadata } from '../interface';
import ToolbarAlignmentDropdown from './ToolbarAlignmentDropdown';
import ToolbarButton from './ToolbarButton';
import ToolbarColorsDropdown from './ToolbarColorsDropdown';
import ToolbarFontFaceDropdown from './ToolbarFontFaceDropdown';
import ToolbarFontSizeDropdown from './ToolbarFontSizeDropdown';
import ToolbarMoreDropdown from './ToolbarMoreDropdown';

const ToolbarEmojiDropdown = lazy(
    () => import(/* webpackChunkName: "ToolbarEmojiDropdown" */ './ToolbarEmojiDropdown')
);

interface ToolbarProps {
    config: ToolbarConfig | undefined;
    metadata: EditorMetadata;
    mailSettings: MailSettings | undefined;
    className?: string;
    openEmojiPickerRef: Ref<() => void>;
    simple?: boolean;
}

const Toolbar = ({ config, metadata, mailSettings, openEmojiPickerRef, className, simple }: ToolbarProps) => {
    const { isNarrow } = useActiveBreakpoint();

    const showMoreDropdown = metadata.supportRightToLeft || metadata.supportPlainText || isNarrow;

    if (metadata.isPlainText) {
        return null;
    }

    if (!config) {
        return null;
    }

    return (
        <ButtonGroup className={classnames(['editor-toolbar overflow-hidden mb-2', className])}>
            <ToolbarFontFaceDropdown
                value={config.fontFace.value}
                setValue={config.fontFace.setValue}
                onClickDefault={config.defaultFont.showModal}
                defaultValue={mailSettings?.FontFace}
                showDefaultFontSelector={metadata.supportDefaultFontSelector}
            />
            <ToolbarFontSizeDropdown
                value={config.fontSize.value}
                setValue={config.fontSize.setValue}
                onClickDefault={config.defaultFont.showModal}
                defaultValue={`${mailSettings?.FontSize || DEFAULT_FONT_SIZE}px`}
                showDefaultFontSelector={metadata.supportDefaultFontSelector}
            />
            <ToolbarColorsDropdown
                fontColor={config.fontColor.value}
                setFontColor={config.fontColor.setValue}
                bgColor={config.backgroundColor.value}
                setBgColor={config.backgroundColor.setValue}
            />
            <>
                <ToolbarButton
                    onClick={config.bold.toggle}
                    aria-pressed={config.bold.isActive}
                    className={classnames(['flex-item-noshrink', config.bold.isActive && 'is-active'])}
                    title={c('Action').t`Bold`}
                    data-testid="editor-bold"
                >
                    <Icon name="text-bold" className="m-auto" alt={c('Action').t`Bold`} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={config.italic.toggle}
                    aria-pressed={config.italic.isActive}
                    className={classnames(['flex-item-noshrink', config.italic.isActive && 'is-active'])}
                    title={c('Action').t`Italic`}
                    data-testid="editor-italic"
                >
                    <Icon name="text-italic" className="m-auto" alt={c('Action').t`Italic`} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={config.underline.toggle}
                    aria-pressed={config.underline.isActive}
                    className={classnames(['flex-item-noshrink', config.underline.isActive && 'is-active'])}
                    title={c('Action').t`Underline`}
                    data-testid="editor-underline"
                >
                    <Icon name="text-underline" className="m-auto" alt={c('Action').t`Underline`} />
                </ToolbarButton>
            </>
            {!isNarrow ? (
                <>
                    <ToolbarButton
                        onClick={config.unorderedList.toggle}
                        aria-pressed={config.unorderedList.isActive}
                        className={classnames(['flex-item-noshrink', config.unorderedList.isActive && 'is-active'])}
                        title={c('Action').t`Unordered list`}
                        data-testid="editor-unordered-list"
                    >
                        <Icon name="list-bullets" className="m-auto on-rtl-mirror" alt={c('Action').t`Unordered list`} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={config.orderedList.toggle}
                        aria-pressed={config.orderedList.isActive}
                        className={classnames(['flex-item-noshrink', config.orderedList.isActive && 'is-active'])}
                        title={c('Action').t`Ordered list`}
                        data-testid="editor-ordered-list"
                    >
                        <Icon name="list-numbers" className="m-auto on-rtl-mirror" alt={c('Action').t`Ordered list`} />
                    </ToolbarButton>
                    <Vr aria-hidden="true" />
                    <ToolbarAlignmentDropdown setAlignment={config.alignment.setValue} />
                    {!simple && (
                        <>
                            <Vr aria-hidden="true" />{' '}
                            <ErrorBoundary component={() => null}>
                                <Suspense fallback={null}>
                                    <ToolbarEmojiDropdown onInsert={config.emoji.insert} openRef={openEmojiPickerRef} />
                                </Suspense>
                            </ErrorBoundary>
                        </>
                    )}
                    <ToolbarButton
                        onClick={config.blockquote.toggle}
                        aria-pressed={config.blockquote.isActive}
                        className={classnames(['flex-item-noshrink', config.blockquote.isActive && 'is-active'])}
                        title={c('Action').t`Quote`}
                        data-testid="editor-quote"
                    >
                        <Icon name="text-quote" className="m-auto" alt={c('Action').t`Quote`} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={config.link.showModal}
                        className="flex-item-noshrink"
                        title={c('Action').t`Insert link`}
                        data-testid="editor-insert-link"
                    >
                        <Icon name="link" className="m-auto" alt={c('Action').t`Insert link`} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={config.formatting.clear}
                        className="flex-item-noshrink"
                        title={c('Action').t`Clear all formatting`}
                        data-testid="editor-clear-formatting"
                    >
                        <Icon name="eraser" className="m-auto" alt={c('Action').t`Clear all formatting`} />
                    </ToolbarButton>
                    {simple && metadata.supportImages && (
                        <>
                            <Vr aria-hidden="true" />
                            <ToolbarButton
                                onClick={config.image.showModal}
                                className="flex-item-noshrink"
                                title={c('Action').t`Insert image`}
                            >
                                <Icon name="file-image" className="m-auto" alt={c('Action').t`Insert image`} />
                            </ToolbarButton>
                        </>
                    )}
                </>
            ) : null}
            {showMoreDropdown && <ToolbarMoreDropdown config={config} metadata={metadata} isNarrow={isNarrow} />}
        </ButtonGroup>
    );
};

export default Toolbar;
