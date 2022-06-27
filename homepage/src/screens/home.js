import { AiOutlineKey } from "react-icons/ai";
import { BiCodeCurly } from 'react-icons/bi';

function Home() {
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
            <div className="big-box flex-col-center">
                <h2>Google Sheets I18N To JSON</h2>
                <p className="text-light-gray">
                    The use of different languages in projects is very common. Managing them in one spreadsheet would be the easiest. Managing them on a service
                    where all developers and clients could see would be the best. This 
                </p>
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
