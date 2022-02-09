import { Link } from 'react-router-dom';
import './TapBar.css';
import Icon from '@mui/material/Icon';
//import { useAuthorization } from '../../hooks/useAuthorization';

function TapBar() {
  //const { userProfile, userSession } = useAuthorization();

  return (
    <nav className='tapBar-navigation'>
      <div>
        <Link to={'/landing'}>
          <Icon className={'home-icon'}>home</Icon>
        </Link>
      </div>
      <div>
        <Link to={'/my-favorites'}>
          <Icon className={'favorite-icon'}>favorite</Icon>
        </Link>
      </div>
      <div>
        <Link to={'/upload-product'}>
          <Icon className={'add-icon'}>add_circle</Icon>
        </Link>
      </div>
      {/* <div>
        {!userSession ? (
          <Link to={'/login'}>
            {' '}
            <Icon className={'login-icon'}>account_circle</Icon>{' '}
          </Link>
        ) : (
          <Link to={'/profile'}>
            {userProfile && userProfile.image ? (
              <img
                className='img-tapbar'
                src={userProfile.image}
                alt='profile'
                height={40}
              />
            ) : (
              <Icon className={'login-icon'}>account_circle</Icon>
            )}
          </Link>
        )}
      </div> */}
    </nav>
  );
}

export default TapBar;
