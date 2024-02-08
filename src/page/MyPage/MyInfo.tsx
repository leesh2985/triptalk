import styled from 'styled-components';
import { AiOutlineSetting } from 'react-icons/ai';
import { DEFAULT_FONT_COLOR, GRAY_COLOR } from '../../color/color';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MyInfoPost from './MyInfoPost';
import MyInfoSaved from './MyInfoSaved';
import TopButton from '../../component/TopButton/TopButton';
import axios from 'axios';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux/es/exports';
import Swal from 'sweetalert2';

interface userInfoDate {
  userId: number;
  name: string;
  profile: string;
  nickname: string;
  email: string;
  password: string;
  aboutMe: string;
  username: string;
  plannerId: number;
  id: number;
  thumbnail: string;
  title: string;
  createAt: number;
  likeCount: number;
  views: number;
}

interface anotheruserInfoDate {
  userId: number;
  nickname: string;
  aboutMe: string;
  profile: string;
  planners: PlannerDetails[];
}

interface PlannerDetails {
  plannerId: number;
  title: string;
  thumbnail: string;
  views: number;
  likeCount: number;
}

export default function MyInfo() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [currentTab, setTab] = useState(0); // 탭기능

  const selectMenuHandler = (index: number) => {
    setTab(index);
  };

  // msw

  const [userInfo, setUserInfo] = useState<userInfoDate>({
    userId: 0,
    plannerId: 0,
    name: '',
    profile: '/img/profile.png',
    nickname: '하하',
    email: 'triptlak.naver.com',
    password: '',
    aboutMe: '안녕하세요 "하하"님 반가워요.',
    username: '',
    id: 0,
    thumbnail: '',
    title: '',
    createAt: 0,
    likeCount: 0,
    views: 0,
  });

  const myInfoMenuTabs = [
    { name: '게시물', content: <MyInfoPost userInfo={userInfo} /> },
    { name: '저장함', content: <MyInfoSaved /> },
  ];

  const [anotherUserInfo, setAnotherUserInfo] = useState<anotheruserInfoDate>({
    userId: 0,
    nickname: '',
    aboutMe: '',
    profile: '',
    planners: [],
  });

  const token = useSelector((state: RootState) => state.token.token);

  useEffect(() => {
    const Access_token = localStorage.getItem('token');
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/address/api/users/profile', {
          headers: {
            Authorization: `Bearer ${Access_token}`,
          },
        });

        if (response.data) {
          setUserInfo(response.data);
        } else {
          console.log(response);
          alert('사용자 정보가 없습니다 로그인확인해주세요');
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 오류 확인바람(내정보):', error);
      }
    };

    fetchUserInfo();
  }, [token]);

  useEffect(() => {
    const Access_token = localStorage.getItem('token');
    const fetchSerch = async () => {
      try {
        const response = await axios.get(`/address/api/search/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${Access_token}`,
          },
        });

        if (response.data) {
          setAnotherUserInfo(response.data);
        } else {
          console.log(response);
          alert('사용자 정보가 없습니다 로그인확인해주세요');
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 오류 확인바람(내정보):', error);
      }
    };

    fetchSerch();
  }, [token, userId]);

  const handleLogOut = () => {
    const storeUserData = localStorage.getItem('token');
    if (storeUserData) {
      Swal.fire({
        icon: 'info',
        title: '로그아웃 하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      }).then(result => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('password');
          Swal.fire({
            icon: 'success',
            title: '로그아웃 되었습니다.',
          }).then(() => {
            navigate('/');
          });
        }
      });
    } else {
      alert('로그인 해주세요.');
      navigate('/');
    }
  };

  return (
    <MyPageContainer>
      {userInfo.userId === anotherUserInfo.userId ? (
        <UserImgContainer>
          <UserImg src={userInfo.profile} />
          <UserNickNameContainer>
            <NickName>{userInfo.nickname}</NickName>
            <Setting to="/editmyinfo">
              <AiOutlineSetting />
            </Setting>
          </UserNickNameContainer>
          <IntroTextContainer>
            <IntroText>{userInfo.aboutMe}</IntroText>
          </IntroTextContainer>
          <UserLogoutBtn onClick={handleLogOut}>로그아웃</UserLogoutBtn>
        </UserImgContainer>
      ) : (
        <UserImgContainer>
          <UserImg src={anotherUserInfo.profile} />
          <UserNickNameContainer>
            <NickName>{anotherUserInfo.nickname}</NickName>
          </UserNickNameContainer>
          <IntroTextContainer>
            <IntroText>{anotherUserInfo.aboutMe}</IntroText>
          </IntroTextContainer>
        </UserImgContainer>
      )}

      {userInfo.userId === anotherUserInfo.userId ? (
        <ContentContainer>
          <ContentUl>
            {myInfoMenuTabs.map((menu, index) => (
              <ContentItem
                key={menu.name}
                className={currentTab === index ? 'active' : ''}
                onClick={() => selectMenuHandler(index)}>
                {menu.name}
              </ContentItem>
            ))}
          </ContentUl>
          {myInfoMenuTabs[currentTab].content}
        </ContentContainer>
      ) : (
        <ContentContainer>
          <ContentUl>
            {myInfoMenuTabs
              .filter(menu => menu.name !== '저장함') // "저장함" 탭 제거
              .map((menu, index) => (
                <ContentItem
                  key={menu.name}
                  className={currentTab === index ? 'active' : ''}
                  onClick={() => selectMenuHandler(index)}>
                  {menu.name}
                </ContentItem>
              ))}
          </ContentUl>
          {myInfoMenuTabs[currentTab].content}
        </ContentContainer>
      )}

      <TopButton />
    </MyPageContainer>
  );
}

const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const UserImgContainer = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1400px) {
    margin-top: 55px;
  }
`;

const UserImg = styled.img`
  width: 300px;
  height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 100%;
  margin: 0 auto;
  @media (max-width: 1400px) {
    width: 280px;
    height: 280px;
  }
  @media (max-width: 1250px) {
    width: 260px;
    height: 260px;
  }
  @media (max-width: 1050px) {
    width: 240px;
    height: 240px;
  }
  @media (max-width: 950px) {
    width: 220px;
    height: 220px;
  }
  @media (max-width: 440px) {
    width: 180px;
    height: 180px;
  }
`;

const UserNickNameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0 20px;
`;

const IntroTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IntroText = styled.p`
  font-size: 25px;
  padding-bottom: 20px;
  @media (max-width: 1400px) {
    font-size: 23px;
  }
  @media (max-width: 1050px) {
    font-size: 21px;
  }
  @media (max-width: 440px) {
    font-size: 16px;
  }
`;

const NickName = styled.p`
  font-size: 25px;
  @media (max-width: 1400px) {
    font-size: 23px;
  }
  @media (max-width: 1050px) {
    font-size: 21px;
    font-weight: 600;
  }
  @media (max-width: 440px) {
    font-size: 18px;
    font-weight: 500;
  }
`;

const Setting = styled(Link)`
  font-size: 25px;
  border: none;
  background-color: transparent;
  color: ${GRAY_COLOR};
  padding-left: 5px;
  cursor: pointer;
  height: 30px;
  @media (max-width: 1400px) {
    font-size: 22px;
  }
  @media (max-width: 1050px) {
    font-size: 20px;
  }
  @media (max-width: 440px) {
    font-size: 16px;
    height: 19px;
  }
  @media (max-width: 390px) {
    font-size: 16px;
    height: 20px;
  }
`;

const UserLogoutBtn = styled.button`
  font-size: 15px;
  border: none;
  background-color: transparent;
  text-decoration: underline;
  margin-bottom: 40px;
  cursor: pointer;
  @media (max-width: 440px) {
    font-size: 10px;
  }
`;

const ContentContainer = styled.div`
  border-top: 1px solid #000;
  margin: 0 auto;
  width: 80%;
`;

const ContentUl = styled.ul`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ContentItem = styled.li`
  padding: 20px 0;
  color: ${GRAY_COLOR};

  cursor: pointer;

  &.active {
    color: ${DEFAULT_FONT_COLOR};
    font-weight: bold;
  }
`;
