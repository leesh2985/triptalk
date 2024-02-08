import { useRef, useState } from 'react';
import styled from 'styled-components';
import Search from './Search/Search';
import { DEFAULT_FONT_COLOR, MAIN_COLOR } from '../color/color';
import { Link, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
import { BiBell } from 'react-icons/bi';
import Modal from './Notice/Modal';
import HamburgerButton from './HamburgerButton';
import MobileMenu from './MobileMenu';

interface NavItemProps {
  $isActive: boolean;
}

interface userInfoDate {
  userId: number;
  name: string;
  profile: string;
  nickname: string;
  email: string;
  password: string;
  aboutMe: string;
  username: string;
}

export default function Header() {
  //  const [userImg, setUserImg] = useState(''); // msw
  // const token = useSelector((state: RootState) => state.token.token); // Redux에서 토큰 가져오기
  const tabsRef = useRef<HTMLUListElement>(null);
  const location = useLocation();
  const [headerUser] = useState<userInfoDate>({
    userId: 0,
    name: '',
    profile: '',
    nickname: '',
    email: '',
    password: '',
    aboutMe: '',
    username: '',
  });
  const [isModalOpen, setModalOpen] = useState(false); // 모달 창 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  // useEffect(() => {
  //   const storedUserData = localStorage.getItem('userInfo');
  //   if (storedUserData) {
  //     const userData = JSON.parse(storedUserData);
  //     console.log(userData.imgUrl);
  //     setImg(userData.imageUrl);
  //   }
  // }, []);

  // 연동
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const fetchUserInfo = async () => {
  //     try {
  //       const response = await axios.get('https://triptalk.xyz/api/users/profile', {
  //         headers: {
  //           Authorization: `Bearer ${token}`, //필수
  //         },
  //       });

  //       if (response.data) {
  //         setHeaderUser(response.data);
  //       } else {
  //         console.log(response);
  //         alert('사용자 정보가 없습니다 로그인확인해주세요');
  //       }
  //     } catch (error) {
  //       console.error('사용자 정보 가져오기 오류 확인바람(헤더):', error);
  //     }
  //   };

  //   fetchUserInfo(); // 비동기 함수 호출
  // }, [token]);

  return (
    <GnbContainer>
      <Gnb>
        <LogoDiv>
          <Logo to="/main">
            <LogoImg src="/img/logo.png" alt="로고" />
          </Logo>
        </LogoDiv>
        <Nav ref={tabsRef}>
          <NavItem to="/main" $isActive={location.pathname === '/main'}>
            홈
          </NavItem>
          <NavItem to="/schedule" $isActive={location.pathname === '/schedule'}>
            전체일정
          </NavItem>
          <NavItem to="/travelmap" $isActive={location.pathname === '/travelmap'}>
            리뷰맵
          </NavItem>
          <Search />
        </Nav>
        <S_Div>
          <User to={`/myinfo/${headerUser.userId}`}>
            {headerUser.profile ? (
              <UserImg src={headerUser.profile} alt="User" />
            ) : (
              <PlaceholderImg src="/img/profile.png" alt="기본프로필" />
            )}
          </User>
          <Notice onClick={handleModalOpen}>
            <Bell />
          </Notice>
          <HamburgerButton onClick={toggleMobileMenu} isOpen={isMobileMenuOpen} />
        </S_Div>
        {isModalOpen && <Modal onClose={handleModalClose} />}
        {isMobileMenuOpen && <MobileMenu location={location} />}
      </Gnb>
      <Stroke />
    </GnbContainer>
  );
}

const GnbContainer = styled.div`
  align-items: center;
  height: auto;
`;

const Gnb = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  height: 70px;
  margin: 0 auto;
  @media (max-width: 1460px) {
    width: 95%;
  }
  @media (max-width: 1080px) {
    width: 90%;
  }
  @media (max-width: 1000px) {
    width: 97%;
  }
`;

const Stroke = styled.div`
  width: 100%;
  border: 0.5px solid #c1c1c1;
`;
const LogoDiv = styled.div`
  height: auto;
  user-select: none;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 115px;
  height: auto;
  @media (max-width: 685px) {
    width: 100px;
  }
`;

const S_Div = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const User = styled(Link)`
  height: 50px;
  @media (max-width: 685px) {
    height: auto;
  }
`;

const UserImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media (max-width: 685px) {
    width: 45px;
    height: 45px;
  }
  @media (max-width: 430px) {
    width: 30px;
    height: 30px;
  }
`;

const PlaceholderImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media (max-width: 685px) {
    width: 45px;
    height: 45px;
  }
  @media (max-width: 430px) {
    width: 30px;
    height: 30px;
  }
`;

const Nav = styled.ul`
  display: flex;
  align-items: center;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const NavItem = styled(Link)<NavItemProps>`
  cursor: pointer;
  color: ${DEFAULT_FONT_COLOR};
  display: block;
  position: relative;
  padding: 7px 10px;
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
  margin-right: 100px;
  text-decoration: none;

  &:hover {
    font-weight: 700;
    color: ${MAIN_COLOR};
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 2px;
    background-color: ${MAIN_COLOR};
    transform: scaleX(0);
    transition: transform 0.2s ease-in-out;
  }

  ${props =>
    props.$isActive &&
    `
    color: ${MAIN_COLOR};
    
    &::after {
      transform: scaleX(1);
    }
  `}

  @media (max-width: 1280px) {
    margin-right: 70px;
    font-size: 18px;
  }
  @media (max-width: 1080px) {
    margin-right: 50px;
    font-size: 1rem;
  }
`;

const Notice = styled.div`
  cursor: pointer;
`;
const Bell = styled(BiBell)`
  font-size: 23px;
  @media (max-width: 685px) {
    font-size: 21px;
  }
  @media (max-width: 430px) {
    font-size: 19px;
  }
`;
