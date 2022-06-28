import { useState } from "react";
import { AiOutlineKey, AiFillAlert } from "react-icons/ai";
import { BiCodeCurly } from 'react-icons/bi';

import Shell from "../components/shell";
import { navigateTo } from "../helper";

function Home() {
    const [codeCopied, setCodeCopied] = useState(false);
    const copyCode = () => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 3000);
    }
    
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const code = params.get('code');

    const features = [
        {
            name: "Google Sheets",
            desc: "Google Sheets integration so everyone(client and developers) can easily collaborate. Learning curve is small and the tool is very universal.",
            logo: <div className="logo google" />
        },
        {
            name: "Easy Setup",
            desc: "The CLI tool helps in quick setup and authentication. Pulling JSON objects are as easy as running a short command. Tokens are also unique and are ignored in .gitignore.",
            logo: <AiOutlineKey color="#B8860B" size={'5rem'} />
        },
        {
            name: "JSON Support",
            desc: "Whatever environment you are using(e.g Node, PHP, DOTNet), there is an easy implementation to read JSON objects to be used in I18N.",
            logo: <BiCodeCurly color="#DAA520" size={'5rem'} />
        },

    ]

    return (
        <div className="flex-col-center home">
            { code &&
                <div className="big-box" style={{ marginBottom: '2rem', position: 'relative' }}>
                    <div
                        onClick={() => navigateTo('home')}
                        className="close">X</div>
                    <h2><AiFillAlert color="yellow" /> Code Detected</h2>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', flexWrap: 'wrap' }}>
                        <p>Code: <span style={{ textDecoration: 'underline' }}>{ code }</span></p>
                        <div
                            onClick={() => copyCode()}
                            className="button start">
                                { codeCopied ? 'Copied' : 'Copy'} {codeCopied && <span style={{ marginLeft: '0.5rem' }}>&#10004;</span>}
                        </div>
                    </div>
                </div>
            }
            <div className="big-box flex-col-center">
                <h2>Google Sheets I18N To JSON</h2>
                <p className="text-light-gray">
                    The use of different languages in projects is very common. Managing them in one spreadsheet would be easy. Managing them on a service
                    where all developers and clients could see would be even easier. This command line tool bridges that goal by making the necessary actions.
                </p>
                <p className="text-light-gray">The general flow:</p>
                <ol className="text-light-gray" >
                    <li>
                        Install library
                    </li>
                    <li>
                        Setup the configurations(token is generate in process) by providing name of the spreadsheet, name and also providing the languages. If the configuration is setup, developers can authorize(if not done already) the command line tool to generate a token to pull json objects.
                    </li>
                    <li>
                        Update messages(not languages) in the google sheet. If necessary, the command line tool can help add or delete languages.
                    </li>
                    <li>
                        Pull JSON objects and use them!
                    </li>
                </ol>
                {/* <p className="text-light-gray">Pulling JSON objects is as easy as:</p>
                <Shell command='gs-i18n-json update' /> */}
                <div
                    // style={{ marginTop: '2rem' }}
                    onClick={() => navigateTo('docs')}
                    className="button start">Getting Started</div>
                {/* <p className="text-light-gray">To begin:</p>
                <Shell command='npm install --save-dev google-sheets-i18n-to-json' />

                <p className="text-light-gray" style={{ marginTop: '1rem' }}>You can utilize the command line tool by 'gs-i18n-json' since the library name is long(still useable though). Setup by use case:</p>
                <p className="text-light-gray"><span className="counter">[1]</span> Normal Initialization: Fresh start, no prior spreadsheet.</p>
                <Shell command='gs-i18n-json init' />
                <p className="text-light-gray"><span className="counter">[2]</span> Linking Initialization: Existing spreadsheet and existing sheet.</p>
                <Shell command='gs-i18n-json link' />
                <p className="text-light-gray"><span className="counter">[3]</span> Linking New Initialization: Existing spreadsheet and but create new sheet.</p>
                <Shell command='gs-i18n-json link-new' />

                <p className="text-light-gray" style={{ marginTop: '1.5rem' }}>After following the steps to setup, simply update to pull the JSON obejcts:</p>
                <Shell command='gs-i18n-json update' />
            
                <p className="text-light-gray" style={{ marginTop: '1.5rem' }}>
                    To add messages, simply add a key representing the message on the end of column A and enter the text of the message for the corresponding language
                    in the corresponding column.
                </p>

                <h3 style={{ marginTop: '1.5rem' }}>Notes</h3>
                <ul className="text-light-gray" >
                    <li>
                        The format of the spreadsheet is specific. A1 will have value of KEYS and items on the first row(1) will be the key of the language.
                        The items on the first column(A) after A1 will be the keys representing the certain texts. Other cells will be the value corresponding to
                        the column(language) and row(key of message).
                    </li>
                    <li>
                        In cases of linking, it is best to use a spreadsheet that was initialized from normal initialization or linking new initialization as the format
                        of the spreadsheet is generated for you. Additionally, when initialization the sheet, the library will add a protected range at the keys as any modification
                        will likely lead to an error.
                    </li>
                    <li>
                        A token is needed for any actions(initialization and updating). Before running any actions, the command line tool will check for this token.
                        If the token is not found or running the commands run into error(e.g token expire), you can simply authorize to generate the token.
                        Upon running the command, you will be directed to google login, and back to the homepage so that you can easily copy the code and paste it into
                        the terminal to generate the token.
                    </li>
                </ul> */}
            </div>
            <div className="flex-center feature-container">
                {features.map(feature => {
                    return (
                        <div
                            key={`feature-${feature.name}`}
                            className="feature-box flex-col-center">
                            {feature.logo}
                            <h3 className="text-light-gray">{feature.name}</h3>
                            <p className="text-dark-gray">{feature.desc}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Home;
