import {
    AiOutlineDownload,
    AiFillFileText,
    AiOutlineKey,
    AiFillFlag,
    AiOutlineLink
} from 'react-icons/ai';
import { BiCodeCurly } from 'react-icons/bi';
import { TbLanguage } from 'react-icons/tb';
import { GiBroom } from 'react-icons/gi';

import Shell from "../components/shell";
import { navigateTo } from "../helper";
import { useRef } from 'react';

function Docs() {
    const installationRef = useRef(null);
    const basicsRef = useRef(null);
    const authorizationRef = useRef(null);
    const initRef = useRef(null);
    const updatingRef = useRef(null);
    const addingLangRef = useRef(null);
    const deletingLangRef = useRef(null);
    const cleaningRef = useRef(null);

    /**
     * Goes to references
     * @param {import('react').RefObject} ref - reference
     */
    const goToRef = (ref) => {
        ref?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="docs">
            <h1 className="text-orange">Getting-Started</h1>
            <p>Easily setup spreadsheet linkinging and run a short command to update json objects.</p>

            <h2 className="text-orange" style={{ marginTop: '2rem' }}>Table of Contents</h2>
            <ul>
                <li style={{ cursor: 'pointer' }} onClick={() => {goToRef(installationRef)}}><AiOutlineDownload /> Installation <AiOutlineLink /></li>
                <li style={{ cursor: 'pointer' }} onClick={() => {goToRef(basicsRef)}}><AiFillFileText /> Basics <AiOutlineLink /></li>
                <li style={{ cursor: 'pointer' }} onClick={() => {goToRef(authorizationRef)}}><AiOutlineKey /> Authorizing <AiOutlineLink /></li>
                <li style={{ cursor: 'pointer' }} onClick={() => {goToRef(initRef)}}>
                    <AiFillFlag /> Initialization <AiOutlineLink />
                    <ol>
                        <li>Normal Initialization</li>
                        <li>Linking Initialization</li>
                        <li>Linking New Initialization</li>
                    </ol>
                </li>
                <li style={{ cursor: 'pointer' }} onClick={() => {goToRef(updatingRef)}}><BiCodeCurly /> Pulling JSON Objects <AiOutlineLink /></li>
                <li>
                    <div
                        onClick={() => {goToRef(addingLangRef)}}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>+<TbLanguage /></span>
                        Adding languages <AiOutlineLink />
                    </div>
                </li>
                <li>
                    <div
                        onClick={() => {goToRef(deletingLangRef)}}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>-<TbLanguage /></span>
                        Deleting languages <AiOutlineLink />
                    </div>
                </li>
                <li style={{ cursor: 'pointer' }} onClick={() => {goToRef(cleaningRef)}}><GiBroom /> Cleaning/Removing Files <AiOutlineLink /></li>
            </ul>

            <h2
                ref={installationRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <AiOutlineDownload />
                Installation
            </h2>
            <p>Using of npm:</p>
            <Shell command='npm install --save-dev google-sheets-i18n-to-json' />

            <p>Using of yarn:</p>
            <Shell command='yarn add google-sheets-i18n-to-json -D' />



            
            <h2
                ref={basicsRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <AiFillFileText />
                Basics
            </h2>
            <p>The following are some notes that might make utilizing this library easier:</p>
            <ul>
                <li>
                    When initializing, configuration file called i18n_config.json is created and stored in the root location.
                    The configuration file consists of:
                    <ul>
                        <li>Path of where to store JSON objects and token</li>
                        <li>List of languages for I18N</li>
                        <li>Spreadsheet ID</li>
                        <li>Sheet name</li>
                    </ul>
                </li>
                <li>
                    An token is required for all google sheet's access(e.g update). Do not worry about creating this token yourself.
                    The generation of the token is very easy. Read below in initialization and authorization to better understand.
                </li>
                <li>
                    In initialization, when selecting languages, you are provided of a standard list of locales. You can select from this
                    to make your life easier. If you want to use your own keys, simply go through initializtion and utilize the adding language command.
                </li>
            </ul>



            <h2
                ref={authorizationRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <AiOutlineKey />
                Authorizing
            </h2>
            <p>
                A token is required when you are initializing or updating json objects. You must first
                initialize so that google-sheets-i18n-to-json knows where to store the token(Note: the 
                token is only saved locally as google-sheets-i18n-to-json will ensure the token file is included in .gitignore).
                When initializing, the process includes retrieving a token. Retrieving a token
                are as follows:
            </p>
            <ol style={{ marginTop: '1rem' }}>
                <li>Wait for command line to prompt authorization link and click on it.</li>
                <li>Login to your google account(access to google sheets will use this account)</li>
                <li>
                    You will then be re-directed to the homepage of this library where you should see
                    a prompt that your code has been detected so that you can copy that code. Click copy.
                </li>
                <li>
                    Paste the code into the terminal.
                    <img
                        style={{ marginTop: '1rem' }}
                        className="example_image"
                        src={require('../styling/code_show_example.png')} />
                </li>
            </ol>
            <p>
                Voila, token is saved.
            </p>

            <p style={{ marginTop: '1.5rem' }}>
                There are cases where you need to generate the token again including but not limited to:
            </p>
            <ul>
                <li>Token expiration</li>
                <li>You picked up a new project, there is a configuration but you need to generate your own token</li>
            </ul>
            <p>
                Then you can easily run the following command to prompt the above steps to generate a token.
            </p>
            <Shell command='gs-i18n-json authorize' />

            <p>If you want to check when your token was generated, run the following to get the date:</p>
            <Shell command='gs-i18n-json token-date' />



            <h2
                ref={initRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <AiFillFlag />
                Initialization
            </h2>
            <p>
                There are three variations to initialization. Use the corresponding one depending on
                your use case. Note, you can add '--force' to all initialization commands to overwrite the current confirugation file if it exists.
            </p>
            <div className="new-h-3">Normal initialization</div>
            <p>
                Typical initial setup. Creates a configuration, select file locations, select languages for I18N,
                select name for spreadsheet and sheet, check .gitignore, creates token, creates spreadsheet and
                finally pulls the JSON objects.
            </p>
            <Shell command='gs-i18n-json init' />
            <div className="new-h-3">Linking Initialization</div>
            <p>
                Assuming the sheet in the spreadsheet has the proper format, pass in the google sheet id
                and select the sheet you would like to link. The creation of the configuration, check of gitignore, creation of token
                will be done and finally the JSON objects will be pulled.
            </p>
            <p>
                The google sheet id can be found in the url: https://docs.google.com/spreadsheets/d/<span style={{ color: 'red' }}>spreadsheetId</span>/edit
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                <p>
                    For more information on spread sheet id, you can visit the google link:
                </p>
                <div
                    onClick={() => navigateTo('google-sheet-id')}
                    className="button blue">here</div>
            </div>
            <Shell command='gs-i18n-json link' />
            <div className="new-h-3">Linking New Initialization</div>
            <p>
                This initialization is a mixture of the previous two. You provide the google sheet id, but create a new sheet by
                providing the name and languages. The same required steps such as configuration and token creation will be done.
            </p>
            <Shell command='gs-i18n-json link-new' />



            <h2
                ref={updatingRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <BiCodeCurly />
                Pulling JSON Objects
            </h2>
            <p>
                After initialization, if you update the spreadsheet and want to pull the JSON objects, run the following code. If 
                you do not have a token, remember
                to <span onClick={() => goToRef(authorizationRef)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>authorize <AiOutlineLink /></span>.
            </p>
            <Shell command='gs-i18n-json update' />




            <h2
                ref={addingLangRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>+<TbLanguage /></span>
                Adding languages
            </h2>
            <p>
                After initialization, you can still add languages, but it is <span style={{ color: 'red' }}>not</span> as 
                simple as adding the key on the first row. You must also add them to the language list in the configuration file.
                Adding languages this way allows you to use any custom key you want. Instead of manually adding them, simply run the following command:
            </p>
            <Shell command='gs-i18n-json add-lang --lang language_1' />
            <p>You can chain languages to add more than one language:</p>
            <Shell command='gs-i18n-json add-lang --lang language_1 --lang language_2 --lang language_3' />




            <h2
                ref={deletingLangRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>-<TbLanguage /></span>
                Deleting languages
            </h2>
            <p>
                After initialization, you can also delete languages, but againm, it is <span style={{ color: 'red' }}>not</span> as 
                simple as removing the corresponding column. You must also remove them in the language list in the configuration file.
                Deleting languages this way also delete the column in the google sheet for you. Instead of manually deleting them, simply run the following command:
            </p>
            <Shell command='gs-i18n-json delete-lang --lang language_1' />
            <p>Similarly to adding languages, you can chain languages to delete more than one language:</p>
            <Shell command='gs-i18n-json delete-lang --lang language_1 --lang language_2 --lang language_3' />




            <h2
                ref={cleaningRef}
                className="text-orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <GiBroom />
                Cleaning/Removing Files
            </h2>
            <p>
                There may be cases where you don't want to push the JSON objects on your git repository or you just want to clean up your token and JSON files.
                Simply run the following to remove all JSON objects and your token. Note that these files are re-generateable by 'update' and 'authorize'.
            </p>
            <Shell command='gs-i18n-json clean' />
            <p>
                What if you want to completely delete all related files of this library in your project? You can do that by simply
                adding --config which will also remove the configuration file.
            </p>
            <Shell command='gs-i18n-json clean --config' />
        </div>
    );
}

export default Docs;
