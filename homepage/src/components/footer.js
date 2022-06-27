import { navigateTo } from '../helper';

function Footer() {

    return (
        <div className="nav-wrapper footer">
            <p
                className='pointer'
                onClick={()=>{navigateTo('privacy-policy')}}>Privacy-Policy</p>
            |
            <p
                className='pointer'
                onClick={()=>{navigateTo('gabrian-git')}}>My Github</p>
        </div>
    );
}

export default Footer;
