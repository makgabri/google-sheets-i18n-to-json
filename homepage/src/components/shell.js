import { useState } from "react";

function Shell(props) {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(props?.command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="shell-box">
            <div className="shell-container">
                <p><span style={{color: '#ec5393'}}>$</span> { props?.command }</p>
                <div
                    className="button green"
                    onClick={() => {copyCode()}}>
                    <p>
                        { copied ? 'Copied' : 'Copy'} {copied && <span>&#10004;</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Shell;
