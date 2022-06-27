import { AiFillGithub, AiFillFileText } from 'react-icons/ai';
import { navigateTo } from '../helper';

function Header() {

    return (
        <div className="nav-wrapper header">
            <div
                onClick={() => {navigateTo('home')}}
                className="home-logo"/>
            <div className='header-nav'>
                <div
                    onClick={() => {navigateTo('docs')}}
                    className='flex-center header-nav-box'>
                    <AiFillFileText size={'2.5rem'} />
                    <h4>Getting-Started</h4>
                </div>
                <div
                    onClick={() => {navigateTo('git')}}
                    className='flex-center header-nav-box'>
                    <AiFillGithub size={'2.5rem'} />
                    <h4>Github</h4>
                </div>
            </div>
        </div>
    );
}

export default Header;
