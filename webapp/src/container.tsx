/// <reference path="../../built/pxtlib.d.ts" />

import * as React from "react";
import * as data from "./data";
import * as sui from "./sui";
import * as tutorial from "./tutorial";
import * as container from "./container";

type ISettingsProps = pxt.editor.ISettingsProps;

// common menu items -- do not remove
// lf("About")
// lf("Getting started")
// lf("Buy")
// lf("Blocks")
// lf("JavaScript")
// lf("Examples")
// lf("Tutorials")
// lf("Projects")
// lf("Reference")
// lf("Support")
// lf("Hardware")

function openTutorial(parent: pxt.editor.IProjectView, path: string) {
    pxt.tickEvent(`docs`, { path }, { interactiveConsent: true });
    parent.setSideDoc(path);
}

function openDocs(parent: pxt.editor.IProjectView, path: string) {
    pxt.tickEvent(`docs`, { path }, { interactiveConsent: true });
    parent.setSideDoc(path);
}

function renderDocItems(parent: pxt.editor.IProjectView, cls: string) {
    const targetTheme = pxt.appTarget.appTheme;
    return targetTheme.docMenu.map(m =>
        m.tutorial ? <sui.Item key={"docsmenututorial" + m.path} role="menuitem" ariaLabel={m.name} text={Util.rlf(m.name)} class={"ui " + cls} onClick={() => openTutorial(parent, m.path)} />
            : !/^\//.test(m.path) ? <a key={"docsmenulink" + m.path} role="menuitem" aria-label={m.name} title={m.name} className={`ui item link ${cls}`} href={m.path} target="docs">{Util.rlf(m.name)}</a>
                : <sui.Item key={"docsmenu" + m.path} role="menuitem" ariaLabel={m.name} text={Util.rlf(m.name)} class={"ui " + cls} onClick={() => openDocs(parent, m.path)} />
    );
}

export class DocsMenuItem extends data.Component<ISettingsProps, {}> {
    constructor(props: ISettingsProps) {
        super(props);
    }

    shouldComponentUpdate(nextProps: ISettingsProps, nextState: any, nextContext: any): boolean {
        return false;
    }

    render() {
        return <sui.DropdownMenuItem icon="help circle large" class="ui mobile hide help-dropdown-menuitem" textClass={"landscape only"} title={lf("Help")}>
            {renderDocItems(this.props.parent, "")}
        </sui.DropdownMenuItem>
    }
}

export interface SettingsMenuItemProps extends ISettingsProps {
    highContrast: boolean;
}

// This Component overrides shouldComponentUpdate, be sure to update that if the state is updated
export interface SettingsMenuItemState {
    highContrast?: boolean;
}

export class SettingsMenuItem extends data.Component<SettingsMenuItemProps, SettingsMenuItemState> {

    openSettings() {
        pxt.tickEvent("menu.settings", undefined, { interactiveConsent: true });
        this.props.parent.openSettings();
    }

    addPackage() {
        pxt.tickEvent("menu.addpackage", undefined, { interactiveConsent: true });
        this.props.parent.addPackage();
    }

    removeProject() {
        pxt.tickEvent("menu.removeproject", undefined, { interactiveConsent: true });
        this.props.parent.removeProject();
    }

    showReportAbuse() {
        pxt.tickEvent("menu.reportabuse", undefined, { interactiveConsent: true });
        this.props.parent.showReportAbuse();
    }

    selectLang() {
        pxt.tickEvent("menu.langpicker", undefined, { interactiveConsent: true });
        this.props.parent.selectLang();
    }

    toggleHighContrast() {
        pxt.tickEvent("menu.togglecontrast", undefined, { interactiveConsent: true });
        this.props.parent.toggleHighContrast();
    }

    reset() {
        pxt.tickEvent("menu.reset", undefined, { interactiveConsent: true });
        pxt.tickEvent("reset"); // Deprecated, will Feb 2018.
        this.props.parent.reset();
    }

    pair() {
        pxt.tickEvent("menu.pair");
        this.props.parent.pair();
    }

    about() {
        pxt.tickEvent("menu.about");
        this.props.parent.about();
    }

    print() {
        this.props.parent.printCode();
    }

    componentWillReceiveProps(nextProps: SettingsMenuItemProps) {
        const newState: SettingsMenuItemState = {};
        if (nextProps.highContrast != undefined) {
            newState.highContrast = nextProps.highContrast;
        }
        if (Object.keys(newState).length > 0) this.setState(newState)
    }

    shouldComponentUpdate(nextProps: SettingsMenuItemProps, nextState: SettingsMenuItemState, nextContext: any): boolean {
        return this.state.highContrast != nextState.highContrast;
    }

    render() {
        const { highContrast } = this.state;
        const targetTheme = pxt.appTarget.appTheme;
        const packages = pxt.appTarget.cloud && pxt.appTarget.cloud.packages;
        const reportAbuse = pxt.appTarget.cloud && pxt.appTarget.cloud.sharing && pxt.appTarget.cloud.publishing && pxt.appTarget.cloud.importing;

        return <sui.DropdownMenuItem icon='setting large' title={lf("More...")} class="more-dropdown-menuitem">
            <sui.Item role="menuitem" icon="options" text={lf("Project Settings")} onClick={() => this.openSettings()} tabIndex={-1} />
            {packages ? <sui.Item role="menuitem" icon="disk outline" text={lf("Extensions")} onClick={() => this.addPackage()} tabIndex={-1} /> : undefined}
            <sui.Item role="menuitem" icon="print" text={lf("Print...")} onClick={() => this.print()} tabIndex={-1} />
            <sui.Item role="menuitem" icon="trash" text={lf("Delete Project")} onClick={() => this.removeProject()} tabIndex={-1} />
            {reportAbuse ? <sui.Item role="menuitem" icon="warning circle" text={lf("Report Abuse...")} onClick={() => this.showReportAbuse()} tabIndex={-1} /> : undefined}
            <div className="ui divider"></div>
            {targetTheme.selectLanguage ? <sui.Item icon="xicon globe" role="menuitem" text={lf("Language")} onClick={() => this.selectLang()} tabIndex={-1} /> : undefined}
            {targetTheme.highContrast ? <sui.Item role="menuitem" text={highContrast ? lf("High Contrast Off") : lf("High Contrast On")} onClick={() => this.toggleHighContrast()} tabIndex={-1} /> : undefined}
            {
                // we always need a way to clear local storage, regardless if signed in or not
            }
            <sui.Item role="menuitem" icon='sign out' text={lf("Reset")} onClick={() => this.reset()} tabIndex={-1} />
            {!pxt.usb.isEnabled ? undefined :
                <sui.Item role="menuitem" icon='usb' text={lf("Pair device")} onClick={() => this.pair()} tabIndex={-1} />}
            <div className="ui mobile only divider"></div>
            {renderDocItems(this.props.parent, "mobile only")}
            <div className="ui divider"></div>
            {targetTheme.privacyUrl ? <a className="ui item" href={targetTheme.privacyUrl} role="menuitem" title={lf("Privacy & Cookies")} target="_blank" tabIndex={-1}>{lf("Privacy & Cookies")}</a> : undefined}
            {targetTheme.termsOfUseUrl ? <a className="ui item" href={targetTheme.termsOfUseUrl} role="menuitem" title={lf("Terms Of Use")} target="_blank" tabIndex={-1}>{lf("Terms Of Use")}</a> : undefined}
            <sui.Item role="menuitem" text={lf("About...")} onClick={() => this.about()} tabIndex={-1} />
            {targetTheme.feedbackUrl ? <div className="ui divider"></div> : undefined}
            {targetTheme.feedbackUrl ? <a className="ui item" href={targetTheme.feedbackUrl} role="menuitem" title={lf("Give Feedback")} target="_blank" rel="noopener" tabIndex={-1}>{lf("Give Feedback")}</a> : undefined}
        </sui.DropdownMenuItem>;
    }
}

export class MainMenu extends data.Component<ISettingsProps, {}> {

    brandIconClick() {
        pxt.tickEvent("menu.brand", undefined, { interactiveConsent: true });
        this.props.parent.exitAndSave();
    }

    orgIconClick() {
        pxt.tickEvent("menu.org", undefined, { interactiveConsent: true });
    }

    goHome() {
        pxt.tickEvent("menu.home", undefined, { interactiveConsent: true });
        this.props.parent.exitAndSave();
    }

    share() {
        pxt.tickEvent("menu.share", undefined, { interactiveConsent: true });
        this.props.parent.share();
    }

    launchFullEditor() {
        pxt.tickEvent("sandbox.openfulleditor", undefined, { interactiveConsent: true });
        this.props.parent.launchFullEditor();
    }

    openSimView() {
        pxt.tickEvent("menu.simView", undefined, { interactiveConsent: true });
        this.props.parent.openSimView();
    }

    openBlocks() {
        pxt.tickEvent("menu.blocks", undefined, { interactiveConsent: true });
        this.props.parent.openBlocks();
    }

    openJavaScript(giveFocusOnLoading = true) {
        pxt.tickEvent("menu.javascript", undefined, { interactiveConsent: true });
        this.props.parent.openJavaScript(giveFocusOnLoading);
    }

    exitTutorial() {
        pxt.tickEvent("menu.exitTutorial", undefined, { interactiveConsent: true });
        this.props.parent.exitTutorial();
    }

    render() {
        const { home, header, highContrast } = this.props.parent.state;
        if (home) return <div />; // Don't render if we're on the home screen

        const targetTheme = pxt.appTarget.appTheme;
        const sharingEnabled = pxt.appTarget.cloud && pxt.appTarget.cloud.sharing;
        const sandbox = pxt.shell.isSandboxMode();
        const tutorialOptions = this.props.parent.state.tutorialOptions;
        const inTutorial = !!tutorialOptions && !!tutorialOptions.tutorial;
        const docMenu = targetTheme.docMenu && targetTheme.docMenu.length && !sandbox && !inTutorial;
        const isRunning = this.props.parent.state.running;
        const hc = !!this.props.parent.state.highContrast;

        const logo = (hc ? targetTheme.highContrastLogo : undefined) || targetTheme.logo;
        const portraitLogo = (hc ? targetTheme.highContrastPortraitLogo : undefined) || targetTheme.portraitLogo;
        const rightLogo = sandbox ? targetTheme.portraitLogo : targetTheme.rightLogo;

        const simActive = this.props.parent.isEmbedSimActive();
        const blockActive = this.props.parent.isBlocksActive();
        const javascriptActive = this.props.parent.isJavaScriptActive();

        const runTooltip = isRunning ? lf("Stop the simulator") : lf("Start the simulator");

        return <div id="mainmenu" className={`ui borderless fixed ${targetTheme.invertedMenu ? `inverted` : ''} menu`} role="menubar" aria-label={lf("Main menu")}>
            {!sandbox ? <div className="left menu">
                <a aria-label={lf("{0} Logo", targetTheme.boardName)} role="menuitem" target="blank" rel="noopener" className="ui item logo brand" tabIndex={0} onClick={() => this.brandIconClick()} onKeyDown={sui.fireClickOnEnter}>
                    {logo || portraitLogo
                        ? <img className={`ui logo ${logo ? " portrait hide" : ''}`} src={Util.toDataUri(logo || portraitLogo)} alt={lf("{0} Logo", targetTheme.boardName)} />
                        : <span className="name">{targetTheme.boardName}</span>}
                    {portraitLogo ? (<img className='ui mini image portrait only' src={Util.toDataUri(portraitLogo)} alt={lf("{0} Logo", targetTheme.boardName)} />) : null}
                </a>
                {targetTheme.betaUrl ? <a href={`${targetTheme.betaUrl}`} className="ui red mini corner top left attached label betalabel" role="menuitem">{lf("Beta")}</a> : undefined}
                {!inTutorial ? <sui.Item class="icon openproject" role="menuitem" textClass="landscape only" icon="home large" ariaLabel={lf("Home screen")} text={lf("Home")} onClick={() => this.goHome()} /> : null}
                {!inTutorial && header && sharingEnabled ? <sui.Item class="icon shareproject" role="menuitem" textClass="widedesktop only" ariaLabel={lf("Share Project")} text={lf("Share")} icon="share alternate large" onClick={() => this.share()} /> : null}
                {inTutorial ? <sui.Item class="tutorialname" tabIndex={-1} textClass="landscape only" text={tutorialOptions.tutorialName} /> : null}
            </div> : <div className="left menu">
                    <span id="logo" className="ui item logo">
                        <img className="ui mini image" src={Util.toDataUri(rightLogo)} tabIndex={0} onClick={() => this.launchFullEditor()} onKeyDown={sui.fireClickOnEnter} alt={`${targetTheme.boardName} Logo`} />
                    </span>
                </div>}
            {!inTutorial && !targetTheme.blocksOnly ? <div className="ui item link editor-menuitem">
                <div className="ui grid padded">
                    {sandbox ? <sui.Item class="sim-menuitem thin portrait only" role="menuitem" textClass="landscape only" text={lf("Simulator")} icon={simActive && isRunning ? "stop" : "play"} active={simActive} onClick={() => this.openSimView()} title={!simActive ? lf("Show Simulator") : runTooltip} /> : undefined}
                    <sui.Item class="blocks-menuitem" role="menuitem" textClass="landscape only" text={lf("Blocks")} icon="xicon blocks" active={blockActive} onClick={() => this.openBlocks()} title={lf("Convert code to Blocks")} />
                    <sui.Item class="javascript-menuitem" role="menuitem" textClass="landscape only" text={lf("JavaScript")} icon="xicon js" active={javascriptActive} onClick={() => this.openJavaScript(false)} title={lf("Convert code to JavaScript")} />
                    <div className="ui item toggle"></div>
                </div>
            </div> : undefined}
            {inTutorial ? <tutorial.TutorialMenuItem parent={this.props.parent} /> : undefined}
            <div className="right menu">
                {docMenu ? <container.DocsMenuItem parent={this.props.parent} /> : undefined}
                {sandbox || inTutorial ? undefined : <container.SettingsMenuItem parent={this.props.parent} highContrast={highContrast} />}

                {sandbox && !targetTheme.hideEmbedEdit ? <sui.Item role="menuitem" icon="external" textClass="mobile hide" text={lf("Edit")} onClick={() => this.launchFullEditor()} /> : undefined}
                {inTutorial ? <sui.ButtonMenuItem class="exit-tutorial-btn" role="menuitem" icon="external" text={lf("Exit tutorial")} textClass="landscape only" onClick={() => this.exitTutorial()} /> : undefined}

                {!sandbox ? <a href={targetTheme.organizationUrl} aria-label={lf("{0} Logo", targetTheme.organization)} role="menuitem" target="blank" rel="noopener" className="ui item logo organization" onClick={() => this.orgIconClick()}>
                    {targetTheme.organizationWideLogo || targetTheme.organizationLogo
                        ? <img className={`ui logo ${targetTheme.organizationWideLogo ? " portrait hide" : ''}`} src={Util.toDataUri(targetTheme.organizationWideLogo || targetTheme.organizationLogo)} alt={lf("{0} Logo", targetTheme.organization)} />
                        : <span className="name">{targetTheme.organization}</span>}
                    {targetTheme.organizationLogo ? (<img className='ui mini image portrait only' src={Util.toDataUri(targetTheme.organizationLogo)} alt={lf("{0} Logo", targetTheme.organization)} />) : null}
                </a> : undefined}
            </div>
        </div>;
    }
}

export interface SideDocsProps extends ISettingsProps {
    docsUrl: string;
    sideDocsCollapsed: boolean;
}

// This Component overrides shouldComponentUpdate, be sure to update that if the state is updated
export interface SideDocsState {
    docsUrl?: string;
    sideDocsCollapsed?: boolean;
}

export class SideDocs extends data.Component<SideDocsProps, SideDocsState> {
    private openingSideDoc = false;

    public static notify(message: pxsim.SimulatorMessage) {
        let sd = document.getElementById("sidedocsframe") as HTMLIFrameElement;
        if (sd && sd.contentWindow) sd.contentWindow.postMessage(message, "*");
    }

    setPath(path: string, blocksEditor: boolean) {
        this.openingSideDoc = true;
        const docsUrl = pxt.webConfig.docsUrl || '/--docs';
        const mode = blocksEditor ? "blocks" : "js";
        const url = `${docsUrl}#doc:${path}:${mode}:${pxt.Util.localeInfo()}`;
        this.setUrl(url);
    }

    setMarkdown(md: string) {
        const docsUrl = pxt.webConfig.docsUrl || '/--docs';
        const mode = this.props.parent.isBlocksEditor() ? "blocks" : "js";
        const url = `${docsUrl}#md:${encodeURIComponent(md)}:${mode}:${pxt.Util.localeInfo()}`;
        this.setUrl(url);
    }

    private setUrl(url: string) {
        let el = document.getElementById("sidedocsframe") as HTMLIFrameElement;
        if (el) el.src = url;
        else this.props.parent.setState({ sideDocsLoadUrl: url, sideDocsCollapsed: false });
    }

    collapse() {
        this.props.parent.setState({ sideDocsCollapsed: true });
    }

    popOut() {
        SideDocs.notify({
            type: "popout"
        })
    }

    toggleVisibility() {
        const state = this.props.parent.state;
        this.props.parent.setState({ sideDocsCollapsed: !state.sideDocsCollapsed });
        document.getElementById("sidedocstoggle").focus();
    }

    componentDidUpdate() {
        this.props.parent.editor.resize();

        let sidedocstoggle = document.getElementById("sidedocstoggle");
        if (this.openingSideDoc && sidedocstoggle) {
            sidedocstoggle.focus();
            this.openingSideDoc = false;
        }
    }

    componentWillReceiveProps(nextProps: SideDocsProps) {
        const newState: SideDocsState = {};
        if (nextProps.sideDocsCollapsed != undefined) {
            newState.sideDocsCollapsed = nextProps.sideDocsCollapsed;
        }
        if (nextProps.docsUrl != undefined) {
            newState.docsUrl = nextProps.docsUrl;
        }
        if (Object.keys(newState).length > 0) this.setState(newState)
    }

    shouldComponentUpdate(nextProps: SideDocsProps, nextState: SideDocsState, nextContext: any): boolean {
        return this.state.sideDocsCollapsed != nextState.sideDocsCollapsed
            || this.state.docsUrl != nextState.docsUrl;
    }

    renderCore() {
        const { sideDocsCollapsed, docsUrl } = this.state;
        if (!docsUrl) return null;

        return <div>
            <button id="sidedocstoggle" role="button" aria-label={sideDocsCollapsed ? lf("Expand the side documentation") : lf("Collapse the side documentation")} className="ui icon button" onClick={() => this.toggleVisibility()}>
                <sui.Icon icon={`icon large inverted ${sideDocsCollapsed ? 'book' : 'chevron right'}`} />
                {sideDocsCollapsed ? <sui.Icon icon={`large inverted chevron left hover`} /> : undefined}
            </button>
            <div id="sidedocs">
                <div id="sidedocsframe-wrapper">
                    <iframe id="sidedocsframe" src={docsUrl} title={lf("Documentation")} aria-atomic="true" aria-live="assertive" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                </div>
                <div className="ui app hide" id="sidedocsbar">
                    <a className="ui icon link" role="link" tabIndex={0} data-content={lf("Open documentation in new tab")} aria-label={lf("Open documentation in new tab")} onClick={() => this.popOut()} onKeyDown={sui.fireClickOnEnter} >
                        <sui.Icon icon="external" />
                    </a>
                </div>
            </div>
        </div>
    }
}

export interface SandboxFooterProps extends ISettingsProps {
}

export class SandboxFooter extends data.Component<SandboxFooterProps, {}> {

    compile() {
        pxt.tickEvent("sandboxfooter.compile", undefined, { interactiveConsent: true });
        this.props.parent.compile();
    }

    shouldComponentUpdate(nextProps: SandboxFooterProps, nextState: any, nextContext: any): boolean {
        return false;
    }

    renderCore() {
        const targetTheme = pxt.appTarget.appTheme;

        const compileTooltip = lf("Download your code to the {0}", targetTheme.boardName);

        return <div className="ui horizontal small divided link list sandboxfooter">
            {targetTheme.organizationUrl && targetTheme.organization ? <a className="item" target="_blank" rel="noopener" href={targetTheme.organizationUrl}>{targetTheme.organization}</a> : undefined}
            <a target="_blank" className="item" href={targetTheme.termsOfUseUrl} rel="noopener">{lf("Terms of Use")}</a>
            <a target="_blank" className="item" href={targetTheme.privacyUrl} rel="noopener">{lf("Privacy")}</a>
            <span className="item"><a className="ui thin portrait only" title={compileTooltip} onClick={() => this.compile()}><sui.Icon icon={`icon ${pxt.appTarget.appTheme.downloadIcon || 'download'}`} />{pxt.appTarget.appTheme.useUploadMessage ? lf("Upload") : lf("Download")}</a></span>
        </div>;
    }
}
